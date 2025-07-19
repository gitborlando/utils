import camelcase from 'camelcase'
import fs from 'fs'
import path from 'path'

export interface GenerateAssetsOptions {
  sourceDir: string
  outputFile: string
  watch: boolean
}

const options: GenerateAssetsOptions = {
  sourceDir: '',
  outputFile: '',
  watch: false,
}

// 递归获取所有文件
function getAllFiles(dir: string, files: string[] = []) {
  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      getAllFiles(fullPath, files)
    } else {
      files.push(fullPath)
    }
  }

  return files
}

// 将文件路径转换为对象结构
function pathToObject(filePath: string) {
  const relativePath = path.relative(options.sourceDir, filePath)
  const parts = relativePath.split(path.sep)
  const fileName = path.basename(parts[parts.length - 1])
  const ext = path.extname(fileName)
  const nameWithoutExt = path.basename(fileName, ext)

  // 转换为驼峰命名
  const camelCase = camelcase(nameWithoutExt)

  // 生成包含路径信息的导入变量名
  const pathParts = [...parts.slice(0, -1), nameWithoutExt]
  const importVarName = camelcase(pathParts.join('-'))

  // 构建相对导入路径
  const importPath = './' + relativePath.replace(/\\/g, '/')

  return {
    parts: parts.slice(0, -1),
    key: camelCase,
    importVarName,
    importPath,
    originalPath: filePath,
  }
}

// 构建嵌套对象
function buildNestedObject(files: string[]) {
  const result: Record<string, any> = {}
  const imports: { importVarName: string; importPath: string }[] = []

  for (const file of files) {
    const { parts, key, importVarName, importPath } = pathToObject(file)
    let current = result

    // 添加import语句
    imports.push({ importVarName, importPath })

    for (const part of parts) {
      // 转换为驼峰命名
      const camelPart = part.replace(/-([a-z])/g, (match, letter) =>
        letter.toUpperCase(),
      )

      if (!current[camelPart]) {
        current[camelPart] = {}
      }
      current = current[camelPart]
    }

    // 使用导入的变量名而不是字符串路径
    current[key] = importVarName
  }

  return { result, imports }
}

// 生成 TypeScript 代码
function generateTypeScriptCode(obj: Record<string, any>, indent = 2) {
  const spaces = ' '.repeat(indent)
  let code = ''

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // 这里是导入的变量名，不加引号
      code += `${spaces}"${key}": ${value},\n`
    } else {
      code += `${spaces}"${key}": {\n`
      code += generateTypeScriptCode(value, indent + 2)
      code += `${spaces}},\n`
    }
  }

  return code
}

// 生成导入语句
function generateImportStatements(
  imports: {
    importVarName: string
    importPath: string
  }[],
) {
  return imports
    .map(
      ({ importVarName, importPath }) =>
        `import ${importVarName} from '${importPath}';`,
    )
    .join('\n')
}

// 确保目录存在
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// 生成资源常量文件
function generateAssetsFile() {
  console.log('开始生成资源路径常量...')

  // 获取所有文件（排除当前要生成的文件）
  const allFiles = getAllFiles(options.sourceDir).filter(
    (file) => path.resolve(file) !== path.resolve(options.outputFile),
  )
  console.log(`找到 ${allFiles.length} 个文件`)

  if (allFiles.length === 0) {
    console.log('没有找到资源文件')
    return
  }

  // 构建对象结构和导入语句
  const { result: assetsObject, imports } = buildNestedObject(allFiles)

  // 生成导入语句
  const importStatements = generateImportStatements(imports)

  // 生成 TypeScript 代码
  const tsCode = `// 自动生成的静态资源路径常量
${importStatements}

export const Assets = {
${generateTypeScriptCode(assetsObject)}
} as const;
`

  // 确保目标目录存在
  ensureDir(path.dirname(options.outputFile))

  // 写入文件
  fs.writeFileSync(options.outputFile, tsCode, 'utf8')
  console.log(`✅ 已生成: ${options.outputFile}`)
  console.log(`包含 ${allFiles.length} 个资源路径`)
}

// 文件监听功能
function watchFiles() {
  console.log('开始监听文件变化...')
  console.log(`监听目录: ${options.sourceDir}`)
  console.log('按 Ctrl+C 停止监听\n')

  const watcher = fs.watch(
    options.sourceDir,

    { recursive: true },
    (eventType, filename) => {
      if (!filename) return

      const outFileName = path.basename(options.outputFile)
      if (filename === outFileName) return

      console.log(`\n检测到文件变化: ${eventType} - ${filename}`)

      if (
        eventType === 'change' ||
        eventType === 'rename' ||
        eventType === 'unlink'
      ) {
        // 等待文件写入完成
        setTimeout(() => {
          console.log('重新生成资源常量文件...')
          generateAssetsFile()
        }, 100)
      }
    },
  )

  // 处理错误
  watcher.on('error', (error) => {
    console.error('监听错误:', error)
  })

  return watcher
}

// 主函数
export function generateAssets(_options: GenerateAssetsOptions) {
  Object.assign(options, _options)

  console.log(options.sourceDir, options.outputFile)

  if (options.watch) {
    const watcher = watchFiles()
    process.on('SIGINT', () => {
      console.log('\n停止监听...')
      watcher.close()
      process.exit(0)
    })
  }

  generateAssetsFile()
}

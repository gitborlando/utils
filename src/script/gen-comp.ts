import camelcase from 'camelcase'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import kebabCase from 'just-kebab-case'
import { join, resolve } from 'path'

export interface GenerateComponentOptions {
  kebabCaseName?: boolean
  tsxTemplate?: (name: string) => string
  lessTemplate?: (name: string) => string
}

export function generateComponent(options: GenerateComponentOptions = {}) {
  options.tsxTemplate ||= defaultComponentTemplate
  options.lessTemplate ||= defaultLessTemplate
  options.kebabCaseName ??= true

  const parentDir = process.argv[2] || process.cwd()
  const inputName = pascalCase(process.argv[3])
  const prefix = pascalCase(process.argv[4] || '')
  const componentName = prefix ? `${prefix}${inputName}` : inputName

  const fileName = options.kebabCaseName ? kebabCase(inputName) : inputName
  const componentDir = resolve(parentDir, fileName)

  // 检查文件夹是否已存在
  if (existsSync(componentDir)) {
    console.error(`❌ 错误: 组件文件夹 "${fileName}" 已存在`)
    process.exit(1)
  }

  // 创建组件文件夹
  try {
    mkdirSync(componentDir, { recursive: true })
    console.log(`📁 创建文件夹: ${componentDir}`)
  } catch (error) {
    console.error('❌ 创建文件夹失败:')
    process.exit(1)
  }

  // 创建 TSX 文件
  const tsxPath = join(componentDir, `index.tsx`)
  try {
    writeFileSync(tsxPath, options.tsxTemplate(componentName).trim(), 'utf8')
    console.log(`📄 创建文件: ${tsxPath}`)
  } catch (error) {
    console.error('❌ 创建 TSX 文件失败:')
    process.exit(1)
  }

  // 创建 LESS 文件
  const lessPath = join(componentDir, `index.less`)
  try {
    writeFileSync(lessPath, options.lessTemplate(componentName).trim(), 'utf8')
    console.log(`🎨 创建文件: ${lessPath}`)
  } catch (error) {
    console.error('❌ 创建 LESS 文件失败:')
    process.exit(1)
  }

  console.log('\n✅ 组件创建成功!')
}

const pascalCase = (name: string) => {
  return camelcase(name, { pascalCase: true })
}

const defaultComponentTemplate = (name: string) => {
  return `import { FC } from 'react'
import './index.less'

interface ${name}Props {}

export const ${name}: FC<${name}Props> = observer(({}) => {
  return (
    <G className='${kebabCase(name)}'></G>
  )
})`
}

const defaultLessTemplate = (name: string) => {
  return `.${kebabCase(name)} {}`
}

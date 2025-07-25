import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

export interface GenerateComponentOptions {
  kebabCaseName?: boolean
  componentTemplate?: (name: string) => string
  lessTemplate?: (name: string) => string
}

export function generateComponent(options: GenerateComponentOptions = {}) {
  options.componentTemplate ||= defaultComponentTemplate
  options.lessTemplate ||= defaultLessTemplate
  options.kebabCaseName ??= false

  const componentName = process.argv[2]

  if (!componentName) {
    console.error('❌ 错误: 请提供组件名称')
    console.log('📝 用法: node scripts/gen-component.js <组件名>')
    console.log('📝 示例: node scripts/gen-component.js MyButton')
    process.exit(1)
  }

  // 验证组件名格式（首字母大写的驼峰命名）
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    console.error('❌ 错误: 组件名必须以大写字母开头，只能包含字母和数字')
    console.log('📝 正确格式示例: MyButton, UserCard, NavigationBar')
    process.exit(1)
  }

  // 将组件名转换为 kebab-case
  const kebabCaseName = componentName.replace(/([A-Z])/g, (match, letter, index) => {
    return index === 0 ? letter.toLowerCase() : '-' + letter.toLowerCase()
  })

  const fileName = options.kebabCaseName ? kebabCaseName : componentName

  // 定义组件文件夹路径
  const componentDir = resolve(process.cwd(), fileName)

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
    writeFileSync(tsxPath, options.componentTemplate(componentName), 'utf8')
    console.log(`📄 创建文件: ${tsxPath}`)
  } catch (error) {
    console.error('❌ 创建 TSX 文件失败:')
    process.exit(1)
  }

  // 创建 LESS 文件
  const lessPath = join(componentDir, `index.less`)
  try {
    writeFileSync(lessPath, options.lessTemplate(componentName), 'utf8')
    console.log(`🎨 创建文件: ${lessPath}`)
  } catch (error) {
    console.error('❌ 创建 LESS 文件失败:')
    process.exit(1)
  }

  console.log('\n✅ 组件创建成功!')
}

const defaultComponentTemplate = (name: string) => {
  return `import { FC } from 'react'
import './index.less'

export interface ${name}Props {
  className?: string
  children?: React.ReactNode
}

export const ${name}: FC<${name}Props> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div
      className={'${name}'}
      {...props}
    >
      {children}
    </div>
  )
}

${name}.displayName = '${name}'`
}

const defaultLessTemplate = (name: string) => {
  return `.${name} {

}
  `
}

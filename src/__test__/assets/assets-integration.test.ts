import fs from 'fs'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { generateAssets, GenerateAssetsOptions } from '../../assets'

describe('generateAssets 集成测试', () => {
  let tempDir: string
  let outputDir: string

  beforeEach(() => {
    // 创建临时目录
    tempDir = path.join(process.cwd(), 'temp-test-assets')
    outputDir = path.join(process.cwd(), 'temp-test-output')

    // 确保目录存在
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
  })

  afterEach(() => {
    // 清理临时文件
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true })
    }
  })

  it('应该生成正确的资源文件结构', () => {
    // 创建测试文件结构
    const imagesDir = path.join(tempDir, 'images')
    const iconsDir = path.join(tempDir, 'icons')

    fs.mkdirSync(imagesDir, { recursive: true })
    fs.mkdirSync(iconsDir, { recursive: true })

    // 创建测试文件
    fs.writeFileSync(path.join(imagesDir, 'logo.png'), 'fake-png-content')
    fs.writeFileSync(path.join(imagesDir, 'avatar.jpg'), 'fake-jpg-content')
    fs.writeFileSync(path.join(iconsDir, 'home.svg'), 'fake-svg-content')
    fs.writeFileSync(path.join(iconsDir, 'menu.svg'), 'fake-svg-content')

    const outputFile = path.join(outputDir, 'assets.ts')

    const options: GenerateAssetsOptions = {
      sourceDir: tempDir,
      outputFile,
      watch: false,
    }

    generateAssets(options)

    // 验证输出文件存在
    expect(fs.existsSync(outputFile)).toBe(true)

    // 读取生成的文件内容
    const generatedContent = fs.readFileSync(outputFile, 'utf8')

    // 验证包含必要的结构
    expect(generatedContent).toContain('// 自动生成的静态资源路径常量')
    expect(generatedContent).toContain('export const Assets = {')
    expect(generatedContent).toContain('} as const;')

    // 验证包含导入语句
    expect(generatedContent).toMatch(/import .* from '\.\/.*';/)

    // 验证包含正确的路径结构
    expect(generatedContent).toContain('images')
    expect(generatedContent).toContain('icons')
  })

  it('应该处理空目录', () => {
    const outputFile = path.join(outputDir, 'empty-assets.ts')

    const options: GenerateAssetsOptions = {
      sourceDir: tempDir,
      outputFile,
      watch: false,
    }

    // 不应该抛出错误
    expect(() => generateAssets(options)).not.toThrow()

    // 当没有文件时，输出文件不会被创建
    expect(fs.existsSync(outputFile)).toBe(false)
  })

  it('应该处理嵌套目录结构', () => {
    // 创建嵌套目录结构
    const nestedDir = path.join(tempDir, 'nested', 'deep', 'folder')
    fs.mkdirSync(nestedDir, { recursive: true })

    // 在嵌套目录中创建文件
    fs.writeFileSync(path.join(nestedDir, 'deep-file.png'), 'fake-content')

    const outputFile = path.join(outputDir, 'nested-assets.ts')

    const options: GenerateAssetsOptions = {
      sourceDir: tempDir,
      outputFile,
      watch: false,
    }

    generateAssets(options)

    // 验证输出文件存在
    expect(fs.existsSync(outputFile)).toBe(true)

    const generatedContent = fs.readFileSync(outputFile, 'utf8')

    // 验证包含嵌套结构
    expect(generatedContent).toContain('nested')
    expect(generatedContent).toContain('deep')
    expect(generatedContent).toContain('folder')
  })

  it('应该正确处理特殊字符文件名', () => {
    // 创建包含特殊字符的文件名
    const specialFile = path.join(tempDir, 'test-file-with-dashes.png')
    fs.writeFileSync(specialFile, 'fake-content')

    const outputFile = path.join(outputDir, 'special-assets.ts')

    const options: GenerateAssetsOptions = {
      sourceDir: tempDir,
      outputFile,
      watch: false,
    }

    generateAssets(options)

    // 验证输出文件存在
    expect(fs.existsSync(outputFile)).toBe(true)

    const generatedContent = fs.readFileSync(outputFile, 'utf8')

    // 验证特殊字符被正确处理（转换为驼峰命名）
    expect(generatedContent).toContain('testFileWithDashes')
  })

  it('应该排除输出文件本身', () => {
    // 在源目录中创建一些测试文件
    fs.writeFileSync(path.join(tempDir, 'test.png'), 'fake-content')

    // 在源目录中创建输出文件
    const outputFile = path.join(tempDir, 'assets.ts')
    fs.writeFileSync(outputFile, 'existing content')

    const options: GenerateAssetsOptions = {
      sourceDir: tempDir,
      outputFile,
      watch: false,
    }

    generateAssets(options)

    // 验证输出文件被重新生成
    const generatedContent = fs.readFileSync(outputFile, 'utf8')
    expect(generatedContent).not.toContain('existing content')
    expect(generatedContent).toContain('// 自动生成的静态资源路径常量')
  })
})

import fs from 'fs'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { generateAssets, GenerateAssetsOptions } from '../../script/gen-assets'

// Mock fs module
vi.mock('fs', () => ({
  default: {
    readdirSync: vi.fn(),
    statSync: vi.fn(),
    writeFileSync: vi.fn(),
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    watch: vi.fn(),
  },
}))

// Mock path module
vi.mock('path', () => ({
  default: {
    join: vi.fn(),
    relative: vi.fn(),
    basename: vi.fn(),
    extname: vi.fn(),
    dirname: vi.fn(),
    sep: '/',
    resolve: vi.fn(),
  },
}))

describe('generateAssets', () => {
  let mockFs: any
  let mockPath: any

  beforeEach(() => {
    mockFs = vi.mocked(fs)
    mockPath = vi.mocked(path)

    // 重置所有 mock
    vi.clearAllMocks()

    // 设置默认的 path mock 返回值
    mockPath.join.mockImplementation((...args: string[]) => args.join('/'))
    mockPath.relative.mockImplementation((from: string, to: string) =>
      to.replace(from + '/', ''),
    )
    mockPath.basename.mockImplementation((filePath: string, ext?: string) => {
      const name = filePath.split('/').pop() || ''
      return ext ? name.replace(ext, '') : name
    })
    mockPath.extname.mockImplementation((filePath: string) => {
      const match = filePath.match(/\.[^.]*$/)
      return match ? match[0] : ''
    })
    mockPath.dirname.mockImplementation((filePath: string) => {
      const parts = filePath.split('/')
      return parts.slice(0, -1).join('/')
    })
    mockPath.resolve.mockImplementation((...args: string[]) => args.join('/'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAllFiles', () => {
    it('应该递归获取所有文件', () => {
      // 模拟文件系统结构
      mockFs.readdirSync
        .mockReturnValueOnce(['images', 'icons', 'test.png']) // 根目录
        .mockReturnValueOnce(['logo.png', 'avatar.jpg']) // images 目录
        .mockReturnValueOnce(['home.svg', 'menu.svg']) // icons 目录

      mockFs.statSync
        .mockReturnValueOnce({ isDirectory: () => true }) // images
        .mockReturnValueOnce({ isDirectory: () => true }) // icons
        .mockReturnValueOnce({ isDirectory: () => false }) // test.png
        .mockReturnValueOnce({ isDirectory: () => false }) // logo.png
        .mockReturnValueOnce({ isDirectory: () => false }) // avatar.jpg
        .mockReturnValueOnce({ isDirectory: () => false }) // home.svg
        .mockReturnValueOnce({ isDirectory: () => false }) // menu.svg

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      // 这里我们需要测试内部函数，但由于它们是私有的，我们通过 generateAssets 来测试
      // 实际测试会在 generateAssetsFile 中进行
      generateAssets(options)

      // 验证 readdirSync 被调用了正确的次数
      expect(mockFs.readdirSync).toHaveBeenCalledTimes(3)
    })
  })

  describe('pathToObject', () => {
    it('应该正确转换文件路径为对象结构', () => {
      const testFilePath = '/test/assets/images/logo.png'

      // 模拟文件系统结构
      mockFs.readdirSync
        .mockReturnValueOnce(['images']) // 根目录
        .mockReturnValueOnce(['logo.png']) // images 目录

      mockFs.statSync
        .mockReturnValueOnce({ isDirectory: () => true }) // images 目录
        .mockReturnValueOnce({ isDirectory: () => false }) // logo.png 文件

      mockPath.relative.mockReturnValue('images/logo.png')
      mockPath.basename.mockReturnValue('logo.png')
      mockPath.extname.mockReturnValue('.png')
      mockFs.existsSync.mockReturnValue(true)

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      generateAssets(options)

      // 验证路径处理函数被调用
      expect(mockPath.relative).toHaveBeenCalled()
      expect(mockPath.basename).toHaveBeenCalled()
    })
  })

  describe('buildNestedObject', () => {
    it('应该构建正确的嵌套对象结构', () => {
      // 模拟文件系统结构
      mockFs.readdirSync
        .mockReturnValueOnce(['images', 'icons']) // 根目录
        .mockReturnValueOnce(['logo.png', 'avatar.jpg']) // images 目录
        .mockReturnValueOnce(['home.svg']) // icons 目录

      mockFs.statSync
        .mockReturnValueOnce({ isDirectory: () => true }) // images 目录
        .mockReturnValueOnce({ isDirectory: () => true }) // icons 目录
        .mockReturnValueOnce({ isDirectory: () => false }) // logo.png 文件
        .mockReturnValueOnce({ isDirectory: () => false }) // avatar.jpg 文件
        .mockReturnValueOnce({ isDirectory: () => false }) // home.svg 文件

      mockFs.existsSync.mockReturnValue(true)

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      generateAssets(options)

      // 验证 writeFileSync 被调用，说明生成了文件
      expect(mockFs.writeFileSync).toHaveBeenCalled()
    })
  })

  describe('generateTypeScriptCode', () => {
    it('应该生成正确的 TypeScript 代码', () => {
      // 模拟文件系统
      mockFs.readdirSync.mockReturnValue(['test.png'])
      mockFs.statSync.mockReturnValue({ isDirectory: () => false })
      mockFs.existsSync.mockReturnValue(true)

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      generateAssets(options)

      // 验证生成的代码包含必要的结构
      const writeCall = mockFs.writeFileSync.mock.calls[0]
      const generatedCode = writeCall[1]

      expect(generatedCode).toContain('// 自动生成的静态资源路径常量')
      expect(generatedCode).toContain('export const Assets = {')
      expect(generatedCode).toContain('} as const;')
    })
  })

  describe('generateImportStatements', () => {
    it('应该生成正确的导入语句', () => {
      // 模拟文件系统
      mockFs.readdirSync.mockReturnValue(['test.png'])
      mockFs.statSync.mockReturnValue({ isDirectory: () => false })
      mockFs.existsSync.mockReturnValue(true)

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      generateAssets(options)

      const writeCall = mockFs.writeFileSync.mock.calls[0]
      const generatedCode = writeCall[1]

      // 验证包含导入语句
      expect(generatedCode).toMatch(/import .* from '\.\/.*';/)
    })
  })

  describe('ensureDir', () => {
    it('应该确保目录存在', () => {
      mockFs.existsSync.mockReturnValue(false)
      mockFs.readdirSync.mockReturnValue(['test.png'])
      mockFs.statSync.mockReturnValue({ isDirectory: () => false })
      mockPath.dirname.mockReturnValue('/test/output')

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      generateAssets(options)

      // 验证 mkdirSync 被调用
      expect(mockFs.mkdirSync).toHaveBeenCalledWith('/test/output', {
        recursive: true,
      })
    })

    it('当目录已存在时不应该创建目录', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([])

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      generateAssets(options)

      // 验证 mkdirSync 没有被调用
      expect(mockFs.mkdirSync).not.toHaveBeenCalled()
    })
  })

  describe('watch mode', () => {
    it('应该设置文件监听', () => {
      const mockWatcher = {
        on: vi.fn(),
        close: vi.fn(),
      }

      mockFs.watch.mockReturnValue(mockWatcher)
      mockFs.readdirSync.mockReturnValue([])

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: true,
      }

      generateAssets(options)

      // 验证 watch 被调用
      expect(mockFs.watch).toHaveBeenCalledWith(
        '/test/assets',
        { recursive: true },
        expect.any(Function),
      )
    })
  })

  describe('错误处理', () => {
    it('当没有找到文件时应该正确处理', () => {
      mockFs.readdirSync.mockReturnValue([])

      const options: GenerateAssetsOptions = {
        sourceDir: '/test/assets',
        outputFile: '/test/output/assets.ts',
        watch: false,
      }

      // 不应该抛出错误
      expect(() => generateAssets(options)).not.toThrow()
    })
  })
})

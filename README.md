# myWebGL


### 用法

```shell
# 启动开发环境
npm run dev

# 打包
npm run build
# dist index.html 直接打开即可
```

页面内 input 控制可调试渲染器内各种渲染参数 例如 位置 大小 视角 光照效果等
页面入口有 '**main()' 是主程序入口
'**test()' 是测试文件入口(简单处理, 未使用 mocha chai 之类断言测试框架)

### 参考资料

threejs 源码库
《opengl shading language》
《opengl 编程指南》

### 文件说明

src/static 静态 mesh 数据文件和 css 文件

canvas.js 核心渲染逻辑文件 包含镜头类 与 canvas 类 处理 mesh 坐标转换 映射 绘制

color.js Color 类文件, 基于 rgba 处理基本的颜色类

config.js 简单的控制台文件 给手动调整 drwa 过程提供入口

index.js 程序入口 加载 mesh 初始化数据

matrix.js 此文件代码各种计算转行逻辑大部分来源于《opengl 编程指南》,小部分来源查找博客,感谢开源社区

mesh.js 模型类 所有模型基于三角形组合 类保存了模型所有顶点和三角形下标数组,通过组合可绘制出完整模型,内置了几个简单的模型基本数据

myMesh.js 网上找到的一些模型数据文件,此类可直接解析模型文件并绘制成需要的模型数据

utils.js 工具函数集合

vector.js Vector 表示三维向量的类,描述模型点位置

vertex.js Vertex 类 表示一个坐标(Vector)与一个颜色(Color) u v 描述贴图坐标位置 w 帮助获取转换前贴图位置


todo...
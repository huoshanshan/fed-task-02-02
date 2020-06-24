# 简单题

# 1、webpack的构建流程主要由那些环节？如果可以尽可能详尽的描述webpack打包的整个过程

# 构建打包环节
# 1、Webpack CLI 启动打包流程
# 2、载入webpack核心模块，创建compiler对象		
# 3、使用compiler对象开始编译整个项目
# 4、从入口文件开始，解析模块依赖，形成依赖关系树
# 5、递归依赖树，将整个项目交给对应的loader处理
# 6、合并loader处理完的结果，将打包结果输出到dist目录

# 过程

# webpack CLI将CLI参数和webpack配置文件中的配置整合，如果出现重复的情况，会优先使用CLI参数，得到一个完整的配置对象例如 ： webpack --mode production

# 有了配置选项过后，开始载入 Webpack 核心模块，传入配置选项，创建 Compiler 对象，这个 Compiler 对象就是整个 Webpack 工作过程中最核心的对象了，负责完成整个项目的构建工作。
# 构建compiler对象
# WebpackOptionsApply首先会初始化几个基础插件，然后把options中对应的选项进行require
# 初始化complier的上下文，loader和file的输入输出环境
# run()：编译的入口方法
# complier具体划分为两个对象
# complier：存放输入输出相关配置信息和编译器parser对象
# watching：监听文件变化的一些处理方法
# run触发compile，接下来就是开始构建otions中的模块
# 构建compilation对象
# 该对象负责组织整个编译过程，包含了每个构建环节所对应的方法
# 对象内部保留了compile对象的引用，冰姐存放所有的modules，chunks，生成的assets以及最后用来生成最后js的template
# compile中触发make时间并调用addEntry
# 找到入口js文件，进行下一步的模块绑定
# 解析入口文件，通过对应的工厂方法创建模块，保存到compilation对象上（通过单例模式保证同样的模块只有一个实例）
# 对module进行build了。包括调用loader处理源文件，使用acorn生成AST并且遍历AST，遇到require，import等依赖时，创建依赖树加入到依赖数组
# module已经build完毕，此时开水处理依赖的module
# 余部的对依赖的module进行build，如果依赖中仍有依赖，则循环处理其依赖

# 调用seal方法封装，逐次对每个module和chunk进行整理，生成编译后的源码，合并，拆分。每个chunk对应一个入口文件
# 开始处理最后生成的js

# 所有的module，chunk仍然保存的是通过一个个require聚合起来的代码，需要通过Template产生最后的带有__webpack__require()的格式
# MainTemplate：处理入口文件的module
# chunkTemplate：处理非首屏，需一步加载的module

# 生成好的js保存在compilation.assets中
# 通过emitAssets将最终的js输出到output的path中




# 2、Loader和Plugin有那些不同？请描述一下开发Loader和Plugin的思路

# loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！ 因为 webpack 本身只能处理 JavaScript，如果要处理其他类型的文件，就需要使用 loader 进行转换，loader 本身就是一个函数，接受源文件为参数，返回转换的结果。

# Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。 通过plugin（插件）webpack可以实 loader 所不能完成的复杂功能，使用 plugin 丰富的自定义 API 以及生命周期事件，可以控制 webpack 打包流程的每个环节，实现对 webpack 的自定义功能扩展

# loader思路

# 每个webpack的Loader都需要导出一个函数，这个函数就是我们这个Loader对资源的处理过程，它的输入就是加载到的资源文件内容，输出就是我们加工后的结果，我们通过source 参数接收输入，通过返回值输出

module.exports = source => {
  // 加载到的模块内容 
  console.log(source)
  // 返回值就是最终被打包的内容
  return 'hello loader ~'
}

# 其实 Webpack 加载资源文件的过程类似于一个工作管道，你可以在这个过程中依次使用多个 Loader，但是最终这个管道结束过后的结果必须是一段标准的 JS 代码字符串。

module.exports = source => {
  // 加载到的模块内容 
  console.log(source)
  // 返回值就是最终被打包的内容
  // return 'hello loader ~'
  return 'console.log("hello loader ~")'
}

# plugin思路

# Webpack的插件机制就是我们在软件开发中最常见的钩子机制，钩子机制类似与web中的事件，webpack整个工作过程会有很多环节，为了便于插件的扩展，webpack几乎每个环节都买下了一个钩子，这样我们在开发插件的时候，通过往这些不同的节点上挂载不同的任务，就可以轻松扩展webpack的能力

# 微博怕吃苦要求我们每个插件必须是一个函数或者是一个包含apply方法的对象，一般我们会定义个类型，在这个类型中定义apply方法，这个方法会在webpack启动时被调用，接收一个compiler对象参数，这个对象是webpack工作过程中最核心的对象，里面包含来此次构建的所有配置信息，就是通过这个对象去注册钩子函数，然后在使用时，通过这个类型来创建一个实例对象去使用

class className {
  apply (compiler) {
    console.log('className 启动')
    // compiler => 包含了我们此次构建的所有配置信息
  }
}

# 还需要明确我们这个任务的执行时机，也就是到底应该把这个任务挂载到哪个钩子上。


class className {
  apply (compiler) {
    compiler.hooks.emit.tap('className', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        console.log(compilation.assets[name].source()) // 输出文件内容

        //这里就可以对文件进行处理
      }
    })
  }
}
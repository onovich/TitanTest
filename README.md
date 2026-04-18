# TitanTest

一个基于《进击的巨人》角色价值取向映射的 React 小测验。

## 本地预览
- 安装依赖：`npm install`
- 启动开发环境：`npm run dev`
- 打开浏览器：`http://127.0.0.1:5173/`

## GitHub Pages 发布
- 仓库已配置自动部署工作流：[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
- 由于仓库名是 `TitanTest`，构建基路径已配置为 `/TitanTest/`
- 正常情况下，你只要 push 到 `main`，GitHub Actions 就会自动构建并发布
- 线上地址通常会是：`https://onovich.github.io/TitanTest/`

如果 GitHub 第一次没有自动开放 Pages，请手动在仓库网页里检查一次：
- 进入 `Settings > Pages`
- 在 `Build and deployment` 中确认来源为 `GitHub Actions`
- 等待 `Deploy to GitHub Pages` 工作流成功

如果 Actions 首次运行后仍没看到页面，通常不是代码问题，而是 GitHub 侧尚未启用 Pages 源。

## 自动化人格模拟测试
- 生成测试报告：`npm run test:personas`
- 严格模式（有校准告警时返回失败）：`npm run test:personas:strict`
- 多轮迭代测试（默认 30 轮，带轻微语义噪声）：`npm run test:iterations`

当前测试包含两层：
- **数值模拟**：按预设人格选项路径校验结果是否接近预期向量。
- **自然语言直觉模拟**：让预设人格先用自然语言自述，再按题目/选项文案的语义去自动选项，检查结果是否符合文本直觉。

语义测试会区分两种情况：
- **校准问题**：选项语义与结果角色明显错位，说明题目文案、分值或维度映射值得调整。
- **自我感知偏差**：用户自我叙述和实际作答不一致，但选项到结果基本合理；这更像结果解释问题，不是打分 bug。

测试报告会输出到：
- [reports/persona-simulation-report.json](reports/persona-simulation-report.json)
- [reports/persona-simulation-report.md](reports/persona-simulation-report.md)

多轮迭代日志会输出到：
- [logs/iterations](logs/iterations)
- 汇总文件：[logs/iterations/summary.md](logs/iterations/summary.md)

其中 [logs/iterations/summary.md](logs/iterations/summary.md) 还会包含 **题目热点统计**：
- 每题各选项在多轮语义模拟中的命中次数
- 哪些选项更常出现在低满意度轮次里
- 哪些选项更常出现在“自我感知偏差”路径里

辅助诊断脚本：
- `node scripts/inspect-matches.js`：查看特定人格路径下最近的角色候选。

## 结构说明
- 应用入口：[main.jsx](main.jsx)
- React 组件主体：[App.jsx](App.jsx)
- 兼容导出入口：[index.js](index.js)
- 数据层：[src/data](src/data)
- 逻辑层：[src/logic](src/logic)
- 视图层：[src/view](src/view)
- 测试层：[src/testing](src/testing)

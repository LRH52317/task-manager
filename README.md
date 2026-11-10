# 智能任务管理系统

基于 Node.js + Supabase + Vercel 构建的任务管理应用。

## 功能

- 输入任务标题 + 选择优先级（高/中/低）添加任务
- 任务列表按创建时间倒序显示
- 每条任务显示标题、优先级标签、完成状态
- 支持切换完成/未完成、删除任务
- 已完成任务自动加删除线、颜色变淡
- 按优先级筛选：全部 / 高 / 中 / 低
- 数据存储在 Supabase 云端数据库

## 技术栈

- 前端：HTML + CSS + JavaScript
- 后端：Vercel Serverless Functions (Node.js)
- 数据库：Supabase (PostgreSQL)
- 部署：Vercel

## 环境变量

| 变量名 | 说明 |
|--------|------|
| SUPABASE_URL | Supabase 项目 URL |
| SUPABASE_ANON_KEY | Supabase 匿名密钥 |

## 本地开发

```bash
npm install
vercel dev
```

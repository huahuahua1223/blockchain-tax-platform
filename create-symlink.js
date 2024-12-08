const fs = require('fs');
const path = require('path');

// 获取项目根目录路径
const projectRoot = path.resolve(__dirname);

// artifacts 文件夹位于项目根目录下
const artifactsPath = path.join(projectRoot, 'artifacts');

// 目标路径：node_modules 下的 artifacts 文件夹
const symlinkPath = path.join(projectRoot, 'node_modules', 'artifacts');

try {
  // 如果符号链接已经存在，先删除
  if (fs.existsSync(symlinkPath)) {
    fs.unlinkSync(symlinkPath);
    console.log(`已删除旧的符号链接：${symlinkPath}`);
  }

  // 创建符号链接
  fs.symlinkSync(artifactsPath, symlinkPath, 'dir');
  console.log(`成功创建符号链接：${symlinkPath} -> ${artifactsPath}`);
} catch (err) {
  console.error('创建符号链接失败:', err);
}

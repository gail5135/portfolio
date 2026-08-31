import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { contentPlugin } from './plugins/content.js';

export default defineConfig({
  // 프로젝트 사이트(gail5135.github.io/portfolio/)로 배포하므로 하위 경로를 지정한다.
  // 이 값이 없으면 배포 후 CSS/JS가 404가 난다.
  base: '/portfolio/',
  plugins: [contentPlugin(), react()],
});

# 포트폴리오

React 개발자 이해창의 포트폴리오 사이트.

**https://gail5135.github.io/portfolio/**

## 내용 고치기

[`content/README.md`](content/README.md) 를 보세요.
`content/` 폴더의 파일만 고치면 되고, GitHub 웹에서 바로 편집해도 됩니다.
`main` 에 커밋하면 GitHub Actions 가 알아서 빌드·배포합니다.

## 로컬에서 실행

```bash
yarn install
yarn dev        # 개발 서버
yarn build      # 타입 검사 + 프로덕션 빌드
yarn preview    # 빌드 결과 미리보기
```

## 구조

```
content/          글. 마크다운과 YAML.
plugins/          content/ 를 빌드 타임에 파싱하는 Vite 플러그인
src/
  content/        파싱된 결과를 타입 붙여 조립
  components/     화면
  styles/         디자인 토큰과 전역 스타일
```

마크다운 파서(marked)와 YAML 파서(js-yaml)는 빌드 타임에만 돌고
브라우저 번들에는 들어가지 않습니다.

## 스택

Vite · React · TypeScript · SCSS Modules

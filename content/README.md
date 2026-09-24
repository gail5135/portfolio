# 내용 고치는 법

이 폴더 안의 파일만 고치면 사이트 내용이 바뀝니다. `src/` 는 열 필요 없습니다.

GitHub 웹에서 파일을 열고 연필 아이콘을 눌러 고친 뒤 커밋하면,
1~2분 뒤 사이트에 자동으로 반영됩니다. 로컬에 내려받을 필요 없습니다.

## 파일별 역할

| 파일 | 화면의 어디 |
|---|---|
| `profile.md` | 맨 위 이름·연락처, About |
| `experience/*.md` | **Work Experience** — 인사이트, 기억에 남는 경험 |
| `timeline/*.md` | **Work Timeline** — 프로젝트 연혁 |
| `companies.yml` | Timeline 의 회사 이름과 재직 기간 |
| `ai.md` | AI 활용 경험 |
| `skills.md` | Skills, 언어 |
| `education.md` | Education |
| `activities.md` | Activities — 동아리 및 학생회 |
| `links.md` | Personal Projects |

두 폴더의 차이:

- `experience/` 는 **읽히려고 쓰는 글**입니다. 무엇을 배웠고 왜 그렇게 판단했는지.
- `timeline/` 은 **무엇을 했는지의 목록**입니다. 사실 위주로 짧게.

## Work Experience 에 글 추가하기

`experience/` 안에 `.md` 파일을 하나 만들면 끝입니다.

```markdown
---
title: 글 제목
navLabel: 짧은 목차 이름
context: Fireside v2.5 AI Agent
period: 2026.05 – 2026.07
tags: [성능, Electron]
---

본문을 씁니다. 문단을 그냥 이어 쓰면 됩니다.

## 소제목

소제목으로 나눠도 되고, 목록을 써도 됩니다.

- 이렇게
```

`title` 만 필수입니다. `context`, `period`, `tags` 는 없으면 화면에서 빠집니다.

## Work Timeline 에 프로젝트 추가하기

`timeline/` 안에 `.md` 파일을 하나 만듭니다.

```markdown
---
company: fasoo-ai
title: 프로젝트 이름
period: 2026.05 – 2026.07
role: 프론트 엔드 개발 전임
stack: [React, Vite]
---

- 한 일을 목록으로 적습니다
- 짧게 적는 편이 좋습니다
```

`company` 는 `companies.yml` 의 `id` 와 같아야 합니다 (`fasoo-ai` 또는 `jinhak`).
`title` 과 `period` 는 필수, `role` 과 `stack` 은 선택입니다.

## 순서 정하기

두 폴더 모두 **파일 이름 앞의 숫자가 화면 순서**입니다.
숫자가 작을수록 위에 나옵니다. (`01-` 이 맨 위)

중간에 끼워 넣고 싶으면 `01-`, `02-` 사이에 `01a-` 같은 이름을 써도 됩니다.

## 회사 추가하기

`companies.yml` 에 항목을 추가하고, 그 `id` 를 `timeline/` 파일의 `company` 에 씁니다.

```yaml
- id: new-company
  name: 회사 이름
  period: 2027.01 – 재직중
  duration: 1년
  employmentType: 정규직
  position: 프론트엔드 개발
```

## 머리말(`---` 사이) 주의사항

- 값에 `:` 가 들어가면 따옴표로 감싸세요. `title: "제목: 부제"`
- 목록은 `[React, Vite]` 처럼 대괄호로 씁니다.

## 잘못 써도 사이트는 안 깨집니다

머리말이 깨진 파일은 그 파일만 화면에서 빠지고 나머지는 정상 동작합니다.
빌드 로그와 브라우저 콘솔에 어떤 파일이 왜 빠졌는지 나옵니다.

Experience 상단 바로가기는 각 글에서 자동 생성됩니다. `navLabel`로 짧은 이름을 지정할 수 있으며, 없으면 `title`을 사용합니다.

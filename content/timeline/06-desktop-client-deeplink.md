---
company: fasoo-ai
title: Electron 전환 및 Windows/macOS 기능 개발
period: "2024.08 – 2025.03"
stack: [Electron]
---

Deep Link, 잠금 화면, 트레이/윈도우 동작을 안정화해 데스크톱 앱 사용성을 개선했습니다.

- Windows URL Scheme 기반 Deep Link 구현
- macOS Deep Link 동작 추가
- commandLine 호출 기반 대화방 열기 기능 확장

<details>
<summary>세부 구현 및 안정화 작업</summary>

- convoId, dsdCode 기반 대화방/도메인 호출 처리
- 잠금 모드 설정 및 잠금 화면 UI/로직 개발
- 비밀번호 입력, 오류 문구, TitleBar, resize, lockScreenView lifecycle 처리
- 트레이 메뉴와 설정 화면, 메인 윈도우 표시/숨김 조건 수정
- OS별 기본 Dialog 적용
- Electron 패키지 및 설치/실행 흐름 관련 이슈 수정

</details>

[팀의 개발 역량에 맞춘 전환 과정 보기](#experience-02-electron-client-migration)

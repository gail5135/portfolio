---
company: fasoo-ai
title: Electron 플랫폼 대응 및 실행 안정화
period: "2026.06 – 2026.09"
stack: [Electron, TypeScript]
---

운영체제와 문서 채팅 진입 경로의 차이를 반영하고 로그인·연결 상태 변경에 따른 앱 동작을 개선했습니다.

- Windows ARM64 지원을 위한 네이티브 암호화 래퍼 모듈 및 아키텍처 분기 추가
- SSO 로그인 확인 중 앱 멈춤, 반복 오프라인 알림, 트레이 클릭 무반응 수정
- 팝업 최소 크기를 웹 콘텐츠 기준으로 처리하고 딥링크 문서방의 창 타입·미리보기 설정 반영

<details>
<summary>실행 환경 개선</summary>

- Electron 41.3.0에서 42.4.0으로 업그레이드하고 관련 빌드 의존성 조정

</details>

---
company: fasoo-ai
title: Fireside Arabic / RTL 지원
period: "2025.11 – 2025.12"
stack: [React, i18n, RTL]
---

아랍어 사용 환경에 맞춰 화면 방향과 입력·날짜 표시를 함께 개선했습니다.


- 언어 변경에 따른 LTR/RTL 전환 로직 구현
- 아이콘 좌우 반전 컴포넌트 구성
- 관리자 콘솔 RTL 적용

<details>
<summary>세부 구현 및 안정화 작업</summary>

- 채팅방, 메시지 입력, 답장, 전달, 유형별 보기, 시스템 메시지 RTL 적용
- 결재선 위젯, 결재선 지정/대리결재자 지정 모달 RTL 적용
- 비밀번호 변경/재설정, 잠금 화면, 앱 다운로드, 이메일 템플릿 리소스 적용
- 아랍어 날짜/시간 포맷 추가
- input, textarea 첫 입력 문자 기준 LTR/RTL 방향 결정 처리
- eCo 웹 채팅 RTL 미동작 현상 수정

</details>

⚙ 개발환경
Framework : Vue.js
Database : HediSQL,MariaDB

🚨 ## 트러블 이슈

### PIN 번호
- 카드 결제 시 보안상 PIN 번호 값을 확인하는 절차가 필요했습니다.

이슈
PIN 번호 확인 과정에서 EventBus를 사용하려 했으나 Vue.js 3.0 버전에서는 지원되지 않았습니다.

해결과정
Pinia를 활용하여 API를 통한 확인 절차를 구현한 후, PIN 번호 확인 컴포넌트를 호출하여 최종적으로 문제를 해결했습니다.

### PG사 연결

이슈
PG사 연결 시 Vue.js에서 데이터가 제대로 전달되지 않는 문제가 발생했습니다.

해결과정
필수 데이터인 PG사 명령어를 `data` 값에 추가하고 `this`를 통해 참조하도록 수정하여 문제를 해결했습니다.

### Global.css

이슈 
이미 진행 중이던 프로젝트에 투입되었는데, 각 페이지의 태그와 마크업 스타일이 달라 CSS 작업 시 비효율성이 높았습니다.

해결과정
페이지의 구조를 아래와 같이 `<header>`와 `<section>` 태그로 통일한 후, `index.html`에서 CSS를 조정하여 해결했습니다.

### 다크모드

이슈 
사람들이 사용하는 핸드폰 모드가 달라 `<inpu>`t태그 등 글씨가 보이지 않는 문제가 발생했습니다.

해결과정
`index.html`에서 다크모드의 제일 큰 부분들을 잡아 준 후, 각 페이지 별로 필요한 작업들 진행했습니다.

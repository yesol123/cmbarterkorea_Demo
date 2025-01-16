⚙ 개발환경</br>
Framework : Vue.js</br>
Database : HediSQL,MariaDB</br>
</br>
### 🚨트러블 이슈
#### PIN 번호
- 카드 결제 시 보안상 PIN 번호 값을 확인하는 절차가 필요했습니다.</br>

[이슈]</br>
PIN 번호 확인 과정에서 EventBus를 사용하려 했으나 Vue.js 3.0 버전에서는 지원되지 않았습니다.</br>

[해결] </br>
1 . Pinia state 값에 사용자가 입력한 pin번호를 저장.</br>
2 . action에서 async/await을 활용한 api 호출 함수로 기존에 저장된 pin번호 확인.</br>
3 . 입력한 pin과 기존에 저장된 pin번호가 일치하는지 확인 후 결제가 진행 되도록 처리.</br>

#### PG사 연결

[이슈]</br>
PG사 연결 시 Vue.js에서 데이터가 제대로 전달되지 않는 문제가 발생했습니다.</br>

[해결] </br>
Vue.js에서는 window.TPO로 불러와야지만 PG사 연동 API가 올바로 호출 가능함을 확인.</br>
필수 데이터인 PG사 명령어를 `data` 값에 추가하고 `this`를 통해 참조하도록 수정하여 문제를 해결.

![image](https://github.com/user-attachments/assets/9c89a0d0-732a-4110-8f3c-f0bf5e5ed8e7)


![image](https://github.com/user-attachments/assets/5231d75a-359b-4103-8800-ea34a415e9ce)


#### Global.css

[이슈]</br>이미 진행 중이던 프로젝트에 투입되었는데, 각 페이지의 태그와 마크업 스타일이 달라 CSS 작업 시 비효율성이 높았습니다.</br>

[해결] </br>페이지의 구조를 아래와 같이 `<header>`와 `<section>` 태그로 통일한 후, `index.html`에서 CSS를 조정하여 해결했습니다.

#### 다크모드

[이슈]</br>사람들이 사용하는 핸드폰 모드가 달라 `<inpu>`t태그 등 글씨가 보이지 않는 문제가 발생했습니다.</br>

[해결] </br>`index.html`에서 다크모드의 제일 큰 부분들을 잡아 준 후, 각 페이지 별로 필요한 작업들 진행했습니다.

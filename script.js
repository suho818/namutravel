const navigationHistory = [];
const navigationHistoryIncludeBack = [];
let startTime;
let timerInterval;
// URL 파라미터 읽기
const {startDocument, targetDocument} = getQueryParams();
// 페이지 로드 시 시작 문서를 자동으로 로드
document.addEventListener("DOMContentLoaded", () => {    
  
  document.getElementById("startDocument").innerText = `시작 문서: ${startDocument}`;
  document.getElementById("targetDocument").innerText = `목표 문서: ${targetDocument}`;
  // 파라미터를 기반으로 게임 초기화
  //document.getElementById("title").innerText = `목표: ${targetDocument}`;
  loadWiki(`https://namu.wiki/w/${startDocument}`);
  
  // URL 파라미터 제거 (주소 변경)
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState(null, "", cleanUrl);
  startTimer();
  });

async function loadWiki(url) {
    const apiUrl = url || document.getElementById("urlInput").value;

    if (!apiUrl.startsWith("https://namu.wiki/")) {
     alert("올바른 나무위키 URL을 입력하세요.");
     return;
  }
  try {
    const response = await fetch(`/api/wiki?url=${encodeURIComponent(apiUrl)}`);
    const data = await response.json();
    // 에러 응답 처리
    if (data.error) {
      alert(data.error);
      document.getElementById("content").innerText = data.error;
      return;
    }

    // 제목과 내용 렌더링
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = data.content || "문서 내용을 가져오는 데 실패했습니다.";

    addToggleEvents();
    addToggleEvents_title();

    // 이동 기록 추가
    navigationHistory.push({ 
      title: data.title, 
      url: apiUrl,
      content: document.getElementById("content").innerHTML, });
    navigationHistoryIncludeBack.push({
      title: data.title,
    })
    

     // 목표 문서 도달 여부 확인
    if (data.title === targetDocument) {
        handleGameEnd(); // 목표 도달 처리
      }

    // 스크롤 맨 위로 이동
    window.scrollTo(0, 0);   // 전체 페이지의 스크롤

   // 하이퍼링크 클릭 이벤트 처리
   addEventHref();
   addEventHrefMove();
  
  
} catch (error) {
    console.error("문서를 가져오는 데 실패했습니다.", error);
    document.getElementById("content").innerText = "문서를 가져오는 데 실패했습니다.";
  }
}

  

  function addToggleEvents() {
    // G2GpSsU1 내 dt[data-v-7ef29777]에 이벤트 리스너 추가
    document.querySelectorAll(".G2GpSsU1 dt[data-v-7ef29777]").forEach((dtElement) => {
      dtElement.addEventListener("click", () => {
        console.log("클릭 이벤트가 실행되었습니다!");
  
        // 동일한 부모 내 _5Ohn5ond 클래스를 가진 요소에 클래스 토글
        const parent = dtElement.parentElement;
        const target = parent.querySelector("._5Ohn5ond");
  
        if (target) {
          target.classList.toggle("xFDiqjuA");
          target.classList.toggle("Zs7985yW");
        }
      });
    });
  }

  function addToggleEvents_title() {
    
        // '_1yDeleYk' 컨테이너 내부를 처리
        document.querySelectorAll("._1yDeleYk > .Nqp3LTMR.NTIQ31uz").forEach((titleWrapper, titleIndex) => {
          const title = titleWrapper.querySelector("._9J0ij2dV"); // 실제 제목 요소
          const nextElement = titleWrapper.nextElementSibling;
          const content = nextElement.querySelector(".xMvbFdJP");
          // 본문 확인: 다음 요소가 'xMvbFdJP' 클래스를 가지고 있는지 체크
          if (nextElement && nextElement.classList.contains("mfFvxbAp")) {
            // 본문이 있는 경우에만 클릭 이벤트 추가
            title.addEventListener("click", () => {
              console.log(`제목 ${titleIndex + 1} 클릭됨`);
      
              // 제목에 클래스 토글
              const isExpanded = title.classList.toggle("gMdAd4od");
              console.log(`제목 상태 변경: ${isExpanded ? "펼침" : "접힘"}`);
      
              // 본문에 클래스 토글
              const isHidden = content.classList.toggle("JSeUt+Tk");
              console.log(`본문 상태 변경: ${isHidden ? "숨김" : "표시"}`);
            });
      
            console.log(`제목 ${titleIndex + 1}에 클릭 이벤트 추가 완료, 본문 연결됨`);
          } else {
            // 본문이 없는 경우
            console.log(`제목 ${titleIndex + 1}에 본문이 없어 클릭 이벤트 추가 안 함`);
          }
        });
    
    }

    document.addEventListener("dragstart", (event) => {//드래그방지
        event.preventDefault();
      });
      
function addEventHref() {
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
  
      if (!href) return; // href가 없는 경우 무시
  
      if (href.startsWith("/w/")) {
        // 다른 문서로 이동하는 경우
        event.preventDefault(); // 기본 이동 동작 차단
        const absoluteUrl = `https://namu.wiki${href}`;
        loadWiki(absoluteUrl); // 새 문서 로드
      } else if (href.startsWith("#")) {
        // 문서 내 이동은 기본 동작 허용
        const targetId = href.slice(1); // #s-1 → s-1
        const targetElement = document.getElementById(targetId);
  
        if (targetElement) {
          event.preventDefault(); // 브라우저 기본 동작 대신 부드러운 스크롤 적용
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}
function addEventHrefMove(){
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 이동 동작 차단
      const targetId = link.getAttribute("href").substring(1); // #id에서 id 추출
      const targetElement = document.getElementById(targetId);
  
      if (targetElement) {
        // 대상 요소의 위치로 스크롤
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition - 100, // 위젯 높이만큼 보정
          behavior: "smooth", // 부드러운 스크롤
        });
      }
    });
  });
}
    // 게임 종료 처리
function handleGameEnd() {
  stopTimer();
  // 현재 타이머 값을 가져오기
  const timerElement = document.querySelector(".timer");
  const elapsedTime = timerElement ? timerElement.textContent.replace("걸린 시간: ", "") : "00:00";


  // 위젯 확장
  const widget = document.querySelector(".widget");
  
  widget.style.position = "fixed";
  widget.style.top = 0;
  widget.style.left = 0;
  widget.style.width = "100%";
  widget.style.height = "100%";
  widget.style.zIndex = 1000;
  widget.style.flexDirection = "column";
  widget.style.justifyContent = "center";
  widget.style.alignItems = "center";
  widget.style.transition = "all 1s ease";

// 기존 내용 제거 후 게임 종료 화면 추가
widget.innerHTML = `
<h1 style="font-size: 2rem; color: #005950;">목표에 도달하였습니다!!</h1>
<p>시작 문서: <strong>${startDocument}</strong></p>
<p>목표 문서: <strong>${targetDocument}</strong></p>
<p>걸린 시간: <strong>${elapsedTime}</strong></p>
<p>경로 길이: <strong>${navigationHistory.length}개 문서</strong></p>
<p style="
      font-size: 1rem; 
      margin: 10px 0; 
      max-width: 500px; /* 최대 너비 제한 */
      overflow-wrap: break-word; /* 단어가 넘치면 줄바꿈 */
      text-align: center;">
      경로: <strong>${navigationHistory.map((record) => record.title).join(" → ")}</strong>
    </p>
<button onclick="restartGame()" style="
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #00a69c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;">
  다시 시작
</button>
`;
}

// 게임 다시 시작 처리
function restartGame() {
  // 게임 데이터를 초기화하거나 페이지를 새로고침
  window.location.href = './index.html'
}


  // URL에서 파라미터 읽기
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    startDocument: params.get("start") || "이상혁",
    targetDocument: params.get("target") || "이재용",
  };
}

function back() {
  if (navigationHistory.length > 1) {
    // 현재 상태를 제거
    navigationHistory.pop();
    navigationHistoryIncludeBack.push({
      title: navigationHistory[navigationHistory.length - 1].title
    })
    console.log(navigationHistoryIncludeBack);
    // 마지막 상태 가져오기
    const lastState = navigationHistory[navigationHistory.length - 1];

    // 제목 및 내용 복원
    document.getElementById("content").innerHTML = lastState.content;
    // 하이퍼링크 클릭 이벤트 처리
   addEventHref();
   addEventHrefMove();
    // 추가로 필요한 로직 처리
    console.log(`뒤로가기: ${lastState.title}`);
    // 스크롤 맨 위로 이동
    window.scrollTo(0, 0);   // 전체 페이지의 스크롤
  } else {
    alert("뒤로 갈 수 있는 기록이 없습니다.");
  }
}

// 타이머 시작 함수
function startTimer() {
  startTime = new Date(); // 시작 시간 기록

  // 매초 갱신
  timerInterval = setInterval(() => {
    const now = new Date();
    const elapsed = Math.round((now - startTime) / 1000); // 경과 시간 (초)
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");

    // 타이머 표시 업데이트
    const timerElement = document.querySelector("#gameTime");
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds}`;
    }
  }, 100);
}

// 타이머 정지 함수
function stopTimer() {
  clearInterval(timerInterval); // 타이머 갱신 중지
}
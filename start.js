// 날짜 표시
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    document.getElementById("date").innerText = formattedDate;
  });
  
  // 게임 시작 함수
  function startGame() {
    const startWord = "이상혁";
    const targetWord = "이재용";
  
    // URL에 파라미터로 변수 전달
    window.location.href = `./game.html?start=${encodeURIComponent(startWord)}&target=${encodeURIComponent(targetWord)}`;
    
}
  
  
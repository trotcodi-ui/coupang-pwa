// =========================
//  팝업 자동 등장 + 홈추가 안내
// =========================

// OS 체크
const ua = navigator.userAgent.toLowerCase();
const isIOS = /iphone|ipad|ipod/.test(ua);
const isAndroid = /android/.test(ua);

let deferredPrompt = null;
let popupShown = false;

// PWA 설치 이벤트 저장 (안드로이드용)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// 팝업 HTML 생성
function createPopup() {
  const popup = document.createElement("div");
  popup.id = "homeAddPopup";
  popup.style.cssText = `
    display:none; position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.55); z-index:99999; justify-content:center;
    align-items:center;
  `;

  popup.innerHTML = `
    <div style="
      background:#fff; padding:20px; border-radius:12px; width:85%; max-width:350px;
      text-align:center; box-shadow:0 6px 20px rgba(0,0,0,0.3);
    ">
      <h3 style="margin-bottom:12px;">📱 홈 화면에 추가</h3>
      <p style="font-size:15px; margin-bottom:22px;">
        홈 화면에 추가하면 방문이 더 편해집니다!
      </p>

      <button id="popupInstallBtn" style="
        background:#007AFF; color:white; padding:12px 20px; border:none;
        border-radius:8px; font-size:16px; width:100%;
      ">홈 화면에 추가하기</button>

      <button id="popupCloseBtn" style="
        margin-top:12px; background:#ddd; padding:10px; width:100%; border-radius:8px;
      ">닫기</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById("popupCloseBtn").onclick = () => {
    popup.style.display = "none";
    localStorage.setItem("popupClosed", "1");
  };

  document.getElementById("popupInstallBtn").onclick = async () => {

    // ANDROID → 설치 프롬프트 띄움
    if (isAndroid && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt = null;
      popup.style.display = "none";
      return;
    }

    // iPHONE → index.html로 이동 (설명 페이지)
    if (isIOS) {
      window.location.href = "https://trotcodi-ui.github.io/coupang-pwa/index.html";
      return;
    }

    alert("홈 화면 추가가 지원되지 않는 환경입니다.");
  };
}

// 팝업 생성
createPopup();

// 스크롤 30% 이후 팝업
window.addEventListener("scroll", () => {
  if (popupShown) return;
  if (localStorage.getItem("popupClosed")) return;

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const percent = (scrollTop / docHeight) * 100;

  if (percent >= 30) {
    popupShown = true;
    document.getElementById("homeAddPopup").style.display = "flex";
  }
});

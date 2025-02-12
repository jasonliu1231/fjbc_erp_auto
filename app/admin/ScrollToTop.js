"use client"

function ScrollToTop() {
  // 1. 保存捲動位置到 history.state
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const state = { ...history.state, scrollPosition };
    console.log(scrollPosition);
    history.replaceState(state, "");
  });

  // 2. 當用戶返回時還原捲動位置
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.scrollPosition) {
      window.scrollTo(0, event.state.scrollPosition);
    }
  });

  return null; // 不渲染任何 UI
}

export default ScrollToTop;

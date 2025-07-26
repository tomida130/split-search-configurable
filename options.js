// 保存ボタンがクリックされたときの処理
document.getElementById("save").addEventListener("click", () => {
  const delimiters = document.getElementById("delimiters").value;
  // chrome.storage.syncに設定を保存
  chrome.storage.sync.set(
    {
      delimiters: delimiters,
    },
    () => {
      // 保存完了をユーザーに通知
      const status = document.getElementById("status");
      status.textContent = "設定を保存しました。";
      setTimeout(() => {
        status.textContent = "";
      }, 1500);
    }
  );
});

// オプションページが開かれたときに、保存されている設定を読み込んで表示する
document.addEventListener("DOMContentLoaded", () => {
  // デフォルト値（スペース、中黒、読点）を設定
  const defaultDelimiters = " ・、";
  chrome.storage.sync.get(
    {
      delimiters: defaultDelimiters,
    },
    (items) => {
      document.getElementById("delimiters").value = items.delimiters;
    }
  );
});

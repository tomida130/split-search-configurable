// 検索を実行する中心的な関数
// 第2引数にタブをアクティブにするかどうかの真偽値(shouldBeActive)を追加
function performSplitSearch(text, shouldBeActive) {
  if (!text) return; // テキストがなければ何もしない

  // 保存された区切り文字を読み込む（なければデフォルト値）
  const defaultDelimiters = " ・、";
  chrome.storage.sync.get(
    {
      delimiters: defaultDelimiters,
    },
    (items) => {
      // 読み込んだ区切り文字で正規表現オブジェクトを作成
      const regex = new RegExp(
        `[${items.delimiters.replace(/\s/g, "\\s")}]+`,
        "g"
      );

      // テキストを分割
      const words = text.split(regex).filter((word) => word);

      // 各単語を検索
      words.forEach((word) => {
        const searchUrl = "https://www.google.com/search?q=";
        const fullUrl = searchUrl + encodeURIComponent(word);
        // ↓ 第2引数で受け取った値を使って、activeの状態を動的に変更
        chrome.tabs.create({ url: fullUrl, active: shouldBeActive });
      });
    }
  );
}

// --- イベントリスナーのセットアップ ---

// 1. 右クリックメニューのセットアップ
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "split-search-context",
    title: "「%s」を分割して検索 (バックグラウンド)",
    contexts: ["selection", "editable"],
  });
});

// 右クリックメニューがクリックされたときに検索を実行
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "split-search-context") {
    // サイトから移動しないように、false を渡す
    performSplitSearch(info.selectionText, false);
  }
});

// 2. アドレスバー(Omnibox)のセットアップ
// アドレスバーでキーワード入力後にEnterが押されたときに検索を実行
chrome.omnibox.onInputEntered.addListener((text) => {
  // 検索結果に移動するように、true を渡す
  performSplitSearch(text, true);
});

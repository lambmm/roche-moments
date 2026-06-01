window.RochePlugin.register({
  id: "roche-moments",
  name: "Roche 朋友圈",
  version: "1.0.0",
  apps: [
    {
      id: "roche-moments-home",
      name: "朋友圈",
      icon: "chat",
      async mount(container, roche) {
        container.innerHTML = `
          <style>
            .rm-root {
              min-height: 100%;
              background: #f5f5f5;
              color: #1f1f1f;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .rm-header {
              height: 190px;
              background: linear-gradient(135deg, #2f3a46, #7d8791);
              position: relative;
              color: white;
              padding: 18px;
              display: flex;
              align-items: flex-end;
              justify-content: flex-end;
            }
            .rm-cover-title {
              position: absolute;
              left: 18px;
              bottom: 22px;
              font-size: 26px;
              font-weight: 800;
              letter-spacing: 1px;
            }
            .rm-user-card {
              display: flex;
              align-items: center;
              gap: 10px;
              transform: translateY(38px);
            }
            .rm-user-name {
              font-size: 16px;
              font-weight: 700;
              text-shadow: 0 1px 4px rgba(0,0,0,.25);
            }
            .rm-avatar {
              width: 64px;
              height: 64px;
              border-radius: 10px;
              object-fit: cover;
              background: #ddd;
              border: 2px solid white;
            }
            .rm-body {
              padding: 52px 12px 24px;
            }
            .rm-card {
              background: white;
              border-radius: 16px;
              padding: 14px;
              margin-bottom: 12px;
              box-shadow: 0 1px 8px rgba(0,0,0,.04);
            }
            .rm-label {
              display: block;
              font-size: 13px;
              color: #666;
              margin-bottom: 6px;
            }
            .rm-select,
            .rm-input,
            .rm-textarea {
              width: 100%;
              border: 1px solid #ddd;
              border-radius: 12px;
              padding: 10px 12px;
              font-size: 14px;
              background: #fff;
              color: #222;
              margin-bottom: 10px;
              box-sizing: border-box;
            }
            .rm-textarea {
              min-height: 80px;
              resize: vertical;
              line-height: 1.5;
            }
            .rm-row {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              align-items: center;
            }
            .rm-btn {
              border: none;
              border-radius: 12px;
              padding: 10px 13px;
              font-size: 14px;
              font-weight: 700;
              background: #1f1f1f;
              color: white;
              cursor: pointer;
            }
            .rm-btn.secondary {
              background: #eeeeee;
              color: #222;
            }
            .rm-btn.danger {
              background: #ffecec;
              color: #c62828;
            }
            .rm-btn:disabled {
              opacity: .45;
              cursor: not-allowed;
            }
            .rm-status {
              font-size: 13px;
              color: #666;
              margin-top: 8px;
              white-space: pre-wrap;
            }
            .rm-api-box {
              display: none;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #eee;
            }
            .rm-api-box.show {
              display: block;
            }
            .rm-post {
              display: flex;
              gap: 10px;
              padding: 14px 2px;
              border-bottom: 1px solid #eee;
            }
            .rm-post:last-child {
              border-bottom: none;
            }
            .rm-post-avatar {
              width: 44px;
              height: 44px;
              border-radius: 8px;
              object-fit: cover;
              background: #ddd;
              flex: 0 0 auto;
            }
            .rm-post-main {
              flex: 1;
              min-width: 0;
            }
            .rm-post-name {
              font-weight: 800;
              color: #3b5274;
              margin-bottom: 4px;
            }
            .rm-post-text {
              font-size: 15px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-break: break-word;
            }
            .rm-time {
              font-size: 12px;
              color: #999;
              margin-top: 8px;
            }
            .rm-actions {
              display: flex;
              gap: 8px;
              margin-top: 8px;
            }
            .rm-mini-btn {
              border: none;
              background: #f0f0f0;
              color: #333;
              padding: 6px 9px;
              border-radius: 8px;
              font-size: 13px;
              cursor: pointer;
            }
            .rm-social-box {
              background: #f3f3f3;
              border-radius: 8px;
              padding: 8px;
              margin-top: 8px;
              font-size: 13px;
            }
            .rm-like-line {
              color: #3b5274;
              margin-bottom: 4px;
            }
            .rm-comment {
              margin-top: 4px;
              line-height: 1.45;
            }
            .rm-comment b {
              color: #3b5274;
            }
            .rm-comment-form {
              display: none;
              margin-top: 8px;
            }
            .rm-comment-form.show {
              display: flex;
              gap: 6px;
            }
            .rm-comment-input {
              flex: 1;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 8px;
              font-size: 13px;
            }
            .rm-empty {
              color: #888;
              text-align: center;
              padding: 24px 8px;
              font-size: 14px;
            }
          </style>

          <div class="rm-root">
            <div class="rm-header">
              <div class="rm-cover-title">朋友圈</div>
              <div class="rm-user-card">
                <div class="rm-user-name" id="rmUserName">我</div>
                <img class="rm-avatar" id="rmUserAvatar" alt="">
              </div>
            </div>

            <div class="rm-body">
              <div class="rm-card">
                <label class="rm-label">选择发朋友圈的角色</label>
                <select id="rmCharacterSelect" class="rm-select">
                  <option value="">正在读取角色...</option>
                </select>

                <label class="rm-label">AI API 选择</label>
                <select id="rmApiMode" class="rm-select">
                  <option value="default">使用 Roche 当前默认 AI 配置</option>
                  <option value="custom">使用自定义 API</option>
                </select>

                <div id="rmApiBox" class="rm-api-box">
                  <label class="rm-label">Provider</label>
                  <input id="rmProvider" class="rm-input" placeholder="例如 openai / openrouter / custom" />

                  <label class="rm-label">模型 Model</label>
                  <input id="rmModel" class="rm-input" placeholder="例如 gemini-3-flash-preview / gpt-4o-mini" />

                  <label class="rm-label">接口 Endpoint</label>
                  <input id="rmEndpoint" class="rm-input" placeholder="例如 https://api.openai.com/v1" />

                  <label class="rm-label">API Key</label>
                  <input id="rmApiKey" class="rm-input" type="password" placeholder="填你的 key，会保存在插件私有 storage" />

                  <button id="rmSaveApi" class="rm-btn secondary">保存 API 设置</button>
                </div>
              </div>

              <div class="rm-card">
                <label class="rm-label">让角色发什么类型的朋友圈？</label>
                <textarea id="rmPostIdea" class="rm-textarea" placeholder="比如：让他发一条下班后的朋友圈；或者：发一条有点吃醋但嘴硬的朋友圈。"></textarea>

                <div class="rm-row">
                  <button id="rmGeneratePost" class="rm-btn">AI 生成并发布</button>
                  <button id="rmManualPost" class="rm-btn secondary">按输入内容直接发布</button>
                  <button id="rmClearPosts" class="rm-btn danger">清空朋友圈</button>
                </div>

                <div id="rmStatus" class="rm-status"></div>
              </div>

              <div class="rm-card">
                <div id="rmFeed"></div>
              </div>
            </div>
          </div>
        `;

        const $ = (sel) => container.querySelector(sel);

        const characterSelect = $("#rmCharacterSelect");
        const apiMode = $("#rmApiMode");
        const apiBox = $("#rmApiBox");
        const providerInput = $("#rmProvider");
        const modelInput = $("#rmModel");
        const endpointInput = $("#rmEndpoint");
        const apiKeyInput = $("#rmApiKey");
        const saveApiBtn = $("#rmSaveApi");
        const postIdea = $("#rmPostIdea");
        const generateBtn = $("#rmGeneratePost");
        const manualBtn = $("#rmManualPost");
        const clearBtn = $("#rmClearPosts");
        const statusEl = $("#rmStatus");
        const feedEl = $("#rmFeed");
        const userNameEl = $("#rmUserName");
        const userAvatarEl = $("#rmUserAvatar");

        let characters = [];
        let userPersona = null;
        let posts = [];
        let settings = {
          apiMode: "default",
          provider: "",
          model: "",
          endpoint: "",
          apiKey: ""
        };

        function escapeHtml(str) {
          return String(str || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
        }

        function uid() {
          if (crypto && crypto.randomUUID) return crypto.randomUUID();
          return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        }

        function formatTime(ts) {
          const d = new Date(ts);
          const now = new Date();
          const diff = Math.floor((now - d) / 1000);
          if (diff < 60) return "刚刚";
          if (diff < 3600) return Math.floor(diff / 60) + "分钟前";
          if (diff < 86400) return Math.floor(diff / 3600) + "小时前";
          return `${d.getMonth() + 1}月${d.getDate日}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        }

        async function savePosts() {
          await roche.storage.set("moments_posts", posts);
        }

        async function saveSettings() {
          await roche.storage.set("moments_settings", settings);
        }

        function getCharById(id) {
          return characters.find(c => c.id === id);
        }

        function getDisplayName(person) {
          return (person && (person.handle || person.name || person.displayName)) || "Unknown";
        }

        function getAvatar(person) {
          return (person && person.avatar) || "";
        }

        function renderFeed() {
          if (!posts || posts.length === 0) {
            feedEl.innerHTML = `<div class="rm-empty">还没有朋友圈。让角色发第一条吧。</div>`;
            return;
          }

          feedEl.innerHTML = posts.map((post) => {
            const liked = post.likes && post.likes.includes("me");
            const likeNames = liked ? `<div class="rm-like-line">♥ ${escapeHtml(getDisplayName(userPersona))}</div>` : "";
            const comments = (post.comments || []).map(c => {
              return `<div class="rm-comment"><b>${escapeHtml(c.authorName)}：</b>${escapeHtml(c.text)}</div>`;
            }).join("");

            const socialBox = likeNames || comments
              ? `<div class="rm-social-box">${likeNames}${comments}</div>`
              : "";

            return `
              <div class="rm-post" data-post-id="${escapeHtml(post.id)}">
                <img class="rm-post-avatar" src="${escapeHtml(post.avatar || "")}" alt="">
                <div class="rm-post-main">
                  <div class="rm-post-name">${escapeHtml(post.authorName)}</div>
                  <div class="rm-post-text">${escapeHtml(post.text)}</div>
                  <div class="rm-time">${formatTime(post.createdAt)}</div>

                  <div class="rm-actions">
                    <button class="rm-mini-btn" data-action="like">${liked ? "取消赞" : "点赞"}</button>
                    <button class="rm-mini-btn" data-action="comment">评论</button>
                    <button class="rm-mini-btn" data-action="delete">删除</button>
                  </div>

                  ${socialBox}

                  <div class="rm-comment-form">
                    <input class="rm-comment-input" placeholder="写评论..." />
                    <button class="rm-mini-btn" data-action="send-comment">发送</button>
                  </div>
                </div>
              </div>
            `;
          }).join("");

          feedEl.querySelectorAll(".rm-post").forEach((postEl) => {
            const postId = postEl.getAttribute("data-post-id");
            const post = posts.find(p => p.id === postId);

            postEl.querySelector('[data-action="like"]').onclick = async () => {
              post.likes = post.likes || [];
              if (post.likes.includes("me")) {
                post.likes = post.likes.filter(x => x !== "me");
              } else {
                post.likes.push("me");
              }
              await savePosts();
              renderFeed();
            };

            postEl.querySelector('[data-action="comment"]').onclick = () => {
              const form = postEl.querySelector(".rm-comment-form");
              form.classList.toggle("show");
              const input = form.querySelector(".rm-comment-input");
              input.focus();
            };

            postEl.querySelector('[data-action="send-comment"]').onclick = async () => {
              const input = postEl.querySelector(".rm-comment-input");
              const text = input.value.trim();
              if (!text) return;
              post.comments = post.comments || [];
              post.comments.push({
                id: uid(),
                authorId: "me",
                authorName: getDisplayName(userPersona),
                text,
                createdAt: Date.now()
              });
              await savePosts();
              renderFeed();
            };

            postEl.querySelector('[data-action="delete"]').onclick = async () => {
              const ok = await roche.ui.confirm({
                title: "删除朋友圈",
                message: "确定删除这条朋友圈吗？"
              });
              if (!ok) return;
              posts = posts.filter(p => p.id !== postId);
              await savePosts();
              renderFeed();
            };
          });
        }

        async function loadInitialData() {
          try {
            statusEl.textContent = "正在读取角色和设置...";

            userPersona = await roche.persona.getActiveUserPersona();
            characters = await roche.character.list();

            posts = (await roche.storage.get("moments_posts")) || [];
            settings = (await roche.storage.get("moments_settings")) || settings;

            userNameEl.textContent = getDisplayName(userPersona);
            userAvatarEl.src = getAvatar(userPersona);

            if (!characters || characters.length === 0) {
              characterSelect.innerHTML = `<option value="">没有读取到角色</option>`;
            } else {
              characterSelect.innerHTML = characters.map(c => {
                return `<option value="${escapeHtml(c.id)}">${escapeHtml(getDisplayName(c))}</option>`;
              }).join("");
            }

            apiMode.value = settings.apiMode || "default";
            providerInput.value = settings.provider || "";
            modelInput.value = settings.model || "";
            endpointInput.value = settings.endpoint || "";
            apiKeyInput.value = settings.apiKey || "";
            apiBox.classList.toggle("show", apiMode.value === "custom");

            statusEl.textContent = "准备好了。";
            renderFeed();
          } catch (err) {
            statusEl.textContent = "初始化失败：" + (err && err.message ? err.message : err);
          }
        }

        apiMode.onchange = async () => {
          settings.apiMode = apiMode.value;
          apiBox.classList.toggle("show", apiMode.value === "custom");
          await saveSettings();
        };

        saveApiBtn.onclick = async () => {
          settings = {
            apiMode: apiMode.value,
            provider: providerInput.value.trim(),
            model: modelInput.value.trim(),
            endpoint: endpointInput.value.trim(),
            apiKey: apiKeyInput.value.trim()
          };
          await saveSettings();
          statusEl.textContent = "API 设置已保存。";
        };

        manualBtn.onclick = async () => {
          const char = getCharById(characterSelect.value);
          const text = postIdea.value.trim();

          if (!char) {
            statusEl.textContent = "请先选择角色。";
            return;
          }

          if (!text) {
            statusEl.textContent = "先写一点朋友圈内容。";
            return;
          }

          posts.unshift({
            id: uid(),
            authorId: char.id,
            authorName: getDisplayName(char),
            avatar: getAvatar(char),
            text,
            likes: [],
            comments: [],
            createdAt: Date.now()
          });

          postIdea.value = "";
          await savePosts();
          renderFeed();
          statusEl.textContent = "已发布。";
        };

        generateBtn.onclick = async () => {
          const char = getCharById(characterSelect.value);
          const idea = postIdea.value.trim();

          if (!char) {
            statusEl.textContent = "请先选择角色。";
            return;
          }

          try {
            generateBtn.disabled = true;
            statusEl.textContent = "AI 正在生成朋友圈，这一步会消耗你选择的 API/token...";

            const charFull = await roche.character.get(char.id);
            const charName = getDisplayName(charFull);
            const userName = getDisplayName(userPersona);

            const prompt = `
你现在要代替角色写一条“微信朋友圈”。

【角色】
名字：${charName}
人设：
${charFull.persona || charFull.bio || charFull.description || ""}

【用户】
名字：${userName}
人设：
${userPersona && (userPersona.persona || userPersona.bio || userPersona.description || "") || ""}

【用户要求】
${idea || "自由发挥，写一条符合角色状态和性格的朋友圈。"}

【输出要求】
- 只输出朋友圈正文，不要解释。
- 中文输出。
- 像真实朋友圈，不要像作文。
- 可以有一点口语感。
- 不要太长，1 到 4 句话。
- 不要使用标题。
- 不要写“朋友圈：”。
- 不要过度煽情。
            `.trim();

            const chatOptions = {
              messages: [{ role: "user", content: prompt }],
              temperature: 0.8
            };

            if (settings.apiMode === "custom") {
              if (settings.provider) chatOptions.provider = settings.provider;
              if (settings.model) chatOptions.model = settings.model;
              if (settings.endpoint) chatOptions.endpoint = settings.endpoint;
              if (settings.apiKey) chatOptions.apiKey = settings.apiKey;
            }

            const result = await roche.ai.chat(chatOptions);
            const text = (result && result.text ? result.text : "").trim();

            if (!text) {
              statusEl.textContent = "AI 没有返回内容。";
              return;
            }

            posts.unshift({
              id: uid(),
              authorId: charFull.id,
              authorName: charName,
              avatar: getAvatar(charFull),
              text,
              likes: [],
              comments: [],
              createdAt: Date.now()
            });

            await savePosts();
            renderFeed();
            statusEl.textContent = "角色已发布朋友圈。";
          } catch (err) {
            statusEl.textContent = "生成失败：" + (err && err.message ? err.message : err);
          } finally {
            generateBtn.disabled = false;
          }
        };

        clearBtn.onclick = async () => {
          const ok = await roche.ui.confirm({
            title: "清空朋友圈",
            message: "确定清空全部朋友圈吗？这个操作只清空插件私有数据，不影响主记忆。"
          });
          if (!ok) return;
          posts = [];
          await savePosts();
          renderFeed();
          statusEl.textContent = "朋友圈已清空。";
        };

        await loadInitialData();
      },
      async unmount(container, roche) {
        container.replaceChildren();
      }
    }
  ]
});

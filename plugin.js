window.RochePlugin.register({
  id: "roche-moments",
  name: "Roche 朋友圈",
  version: "1.1.0",
  apps: [
    {
      id: "roche-moments-home",
      name: "朋友圈",
      icon: "chat",
      async mount(container, roche) {
        let autoTimer = null;

        container.innerHTML = `
          <style>
            .rm-root {
              height: 100%;
              min-height: 100%;
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
              background: #f2f2f2;
              color: #1f1f1f;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }

            .rm-header {
              height: 235px;
              background: linear-gradient(135deg, #33414d, #7b858f);
              position: relative;
              color: white;
              padding: 18px;
              display: flex;
              align-items: flex-end;
              justify-content: flex-end;
            }

            .rm-close-tip {
              position: absolute;
              top: 16px;
              left: 18px;
              font-size: 13px;
              opacity: 0.72;
            }

            .rm-cover-title {
              position: absolute;
              left: 20px;
              bottom: 66px;
              font-size: 30px;
              font-weight: 850;
              letter-spacing: 1px;
            }

            .rm-user-card {
              display: flex;
              align-items: center;
              gap: 12px;
              transform: translateY(42px);
            }

            .rm-user-name {
              font-size: 19px;
              font-weight: 800;
              text-shadow: 0 1px 4px rgba(0,0,0,.32);
            }

            .rm-avatar {
              width: 76px;
              height: 76px;
              border-radius: 12px;
              object-fit: cover;
              background: #ddd;
              border: 3px solid white;
              box-shadow: 0 2px 10px rgba(0,0,0,.18);
            }

            .rm-body {
              padding: 58px 12px 32px;
            }

            .rm-card {
              background: white;
              border-radius: 18px;
              padding: 14px;
              margin-bottom: 13px;
              box-shadow: 0 1px 8px rgba(0,0,0,.045);
            }

            .rm-section-title {
              font-size: 16px;
              font-weight: 800;
              margin-bottom: 10px;
            }

            .rm-label {
              display: block;
              font-size: 13px;
              color: #666;
              margin: 8px 0 6px;
            }

            .rm-select,
            .rm-textarea {
              width: 100%;
              border: 1px solid #ddd;
              border-radius: 13px;
              padding: 11px 12px;
              font-size: 15px;
              background: #fff;
              color: #222;
              margin-bottom: 10px;
              box-sizing: border-box;
            }

            .rm-textarea {
              min-height: 88px;
              resize: vertical;
              line-height: 1.55;
            }

            .rm-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }

            .rm-row {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              align-items: center;
            }

            .rm-btn {
              border: none;
              border-radius: 14px;
              padding: 11px 14px;
              font-size: 14px;
              font-weight: 750;
              background: #191919;
              color: white;
              cursor: pointer;
            }

            .rm-btn.secondary {
              background: #eeeeee;
              color: #222;
            }

            .rm-btn.danger {
              background: #fff0f0;
              color: #c62828;
            }

            .rm-btn:disabled {
              opacity: .48;
              cursor: not-allowed;
            }

            .rm-status {
              font-size: 13px;
              color: #666;
              margin-top: 9px;
              white-space: pre-wrap;
              line-height: 1.5;
            }

            .rm-feed-card {
              background: white;
              border-radius: 18px;
              padding: 8px 12px;
              margin-bottom: 14px;
              box-shadow: 0 1px 8px rgba(0,0,0,.045);
            }

            .rm-post {
              display: flex;
              gap: 10px;
              padding: 14px 0;
              border-bottom: 1px solid #ededed;
            }

            .rm-post:last-child {
              border-bottom: none;
            }

            .rm-post-avatar {
              width: 46px;
              height: 46px;
              border-radius: 9px;
              object-fit: cover;
              background: #ddd;
              flex: 0 0 auto;
            }

            .rm-post-main {
              flex: 1;
              min-width: 0;
            }

            .rm-post-name {
              font-weight: 850;
              color: #3b5274;
              margin-bottom: 4px;
              font-size: 15px;
            }

            .rm-post-text {
              font-size: 15px;
              line-height: 1.62;
              white-space: pre-wrap;
              word-break: break-word;
            }

            .rm-sticker {
              margin-top: 9px;
              width: 132px;
              height: 132px;
              border-radius: 12px;
              background: linear-gradient(135deg, #f7f7f7, #e9eef5);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 58px;
              box-shadow: inset 0 0 0 1px rgba(0,0,0,.04);
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
              gap: 6px;
            }

            .rm-comment-form.show {
              display: flex;
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
              padding: 26px 8px;
              font-size: 14px;
            }

            .rm-small-note {
              font-size: 12px;
              color: #888;
              line-height: 1.5;
              margin-top: 8px;
            }
          </style>

          <div class="rm-root">
            <div class="rm-header">
              <div class="rm-close-tip">Roche Moments</div>
              <div class="rm-cover-title">朋友圈</div>
              <div class="rm-user-card">
                <div class="rm-user-name" id="rmUserName">我</div>
                <img class="rm-avatar" id="rmUserAvatar" alt="">
              </div>
            </div>

            <div class="rm-body">
              <div class="rm-card">
                <div class="rm-section-title">发布设置</div>

                <label class="rm-label">选择发朋友圈的角色</label>
                <select id="rmCharacterSelect" class="rm-select">
                  <option value="">正在读取角色...</option>
                </select>

                <div class="rm-grid">
                  <div>
                    <label class="rm-label">读取最近聊天</label>
                    <select id="rmContextLimit" class="rm-select">
                      <option value="0">不读取</option>
                      <option value="10">10 条</option>
                      <option value="20">20 条</option>
                      <option value="50" selected>50 条</option>
                      <option value="100">100 条</option>
                    </select>
                  </div>

                  <div>
                    <label class="rm-label">配图模式</label>
                    <select id="rmImageMode" class="rm-select">
                      <option value="none">无图</option>
                      <option value="sticker" selected>随机表情包</option>
                    </select>
                  </div>
                </div>

                <label class="rm-label">自动发朋友圈</label>
                <select id="rmAutoMode" class="rm-select">
                  <option value="off">关闭</option>
                  <option value="5">每 5 分钟测试</option>
                  <option value="30">每 30 分钟</option>
                  <option value="60">每 1 小时</option>
                  <option value="180">每 3 小时</option>
                  <option value="360">每 6 小时</option>
                </select>

                <div class="rm-small-note">
                  自动发布只在 Roche 页面打开、插件运行时可靠。关掉网页或手机后台休眠后，它不会像服务器一样继续运行。
                </div>
              </div>

              <div class="rm-card">
                <div class="rm-section-title">让角色发朋友圈</div>

                <label class="rm-label">可选要求</label>
                <textarea id="rmPostIdea" class="rm-textarea" placeholder="比如：让他发一条下班后的朋友圈；或者：发一条有点吃醋但嘴硬的朋友圈。不填也可以，它会根据最近聊天自己发挥。"></textarea>

                <div class="rm-row">
                  <button id="rmGeneratePost" class="rm-btn">让角色发一条</button>
                  <button id="rmManualPost" class="rm-btn secondary">把输入内容直接发布</button>
                  <button id="rmClearPosts" class="rm-btn danger">清空</button>
                </div>

                <div id="rmStatus" class="rm-status"></div>
              </div>

              <div class="rm-feed-card">
                <div id="rmFeed"></div>
              </div>
            </div>
          </div>
        `;

        const $ = (sel) => container.querySelector(sel);

        const characterSelect = $("#rmCharacterSelect");
        const contextLimitSelect = $("#rmContextLimit");
        const imageModeSelect = $("#rmImageMode");
        const autoModeSelect = $("#rmAutoMode");
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
          characterId: "",
          contextLimit: 50,
          imageMode: "sticker",
          autoMinutes: 0,
          lastAutoPostAt: 0
        };

        const stickerPool = [
          "😶", "😑", "😒", "🙄", "😴", "😮‍💨", "🤨", "🫠",
          "🐷", "🐈‍⬛", "☕", "🍵", "🌧️", "🌙", "🖤", "💬",
          "🥀", "🧊", "🍟", "🍺", "🛒", "🚬", "🧸", "📷"
        ];

        function escapeHtml(value) {
          return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
        }

        function uid() {
          if (window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
          }
          return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        }

        function formatTime(timestamp) {
          const d = new Date(timestamp);
          const now = new Date();
          const diff = Math.floor((now - d) / 1000);

          if (diff < 60) return "刚刚";
          if (diff < 3600) return Math.floor(diff / 60) + "分钟前";
          if (diff < 86400) return Math.floor(diff / 3600) + "小时前";

          const month = d.getMonth() + 1;
          const date = d.getDate();
          const hour = String(d.getHours()).padStart(2, "0");
          const minute = String(d.getMinutes()).padStart(2, "0");

          return month + "月" + date + "日 " + hour + ":" + minute;
        }

        function getDisplayName(person) {
          if (!person) return "Unknown";
          return person.handle || person.name || person.displayName || "Unknown";
        }

        function getAvatar(person) {
          if (!person) return "";
          return person.avatar || "";
        }

        function getCharById(id) {
          return characters.find((c) => c.id === id);
        }

        function randomItem(list) {
          return list[Math.floor(Math.random() * list.length)];
        }

        async function savePosts() {
          await roche.storage.set("moments_posts_v2", posts);
        }

        async function saveSettings() {
          await roche.storage.set("moments_settings_v2", settings);
        }

        async function persistSettingsFromUI() {
          settings.characterId = characterSelect.value || "";
          settings.contextLimit = Number(contextLimitSelect.value || 0);
          settings.imageMode = imageModeSelect.value || "none";
          settings.autoMinutes = Number(autoModeSelect.value || 0);
          await saveSettings();
          setupAutoTimer();
        }

        function renderFeed() {
          if (!posts || posts.length === 0) {
            feedEl.innerHTML = `<div class="rm-empty">还没有朋友圈。让角色发第一条吧。</div>`;
            return;
          }

          feedEl.innerHTML = posts.map((post) => {
            const liked = post.likes && post.likes.includes("me");

            const likeLine = liked
              ? `<div class="rm-like-line">♥ ${escapeHtml(getDisplayName(userPersona))}</div>`
              : "";

            const comments = (post.comments || []).map((comment) => {
              return `<div class="rm-comment"><b>${escapeHtml(comment.authorName)}：</b>${escapeHtml(comment.text)}</div>`;
            }).join("");

            const socialBox = likeLine || comments
              ? `<div class="rm-social-box">${likeLine}${comments}</div>`
              : "";

            const sticker = post.sticker
              ? `<div class="rm-sticker">${escapeHtml(post.sticker)}</div>`
              : "";

            return `
              <div class="rm-post" data-post-id="${escapeHtml(post.id)}">
                <img class="rm-post-avatar" src="${escapeHtml(post.avatar)}" alt="">
                <div class="rm-post-main">
                  <div class="rm-post-name">${escapeHtml(post.authorName)}</div>
                  <div class="rm-post-text">${escapeHtml(post.text)}</div>
                  ${sticker}
                  <div class="rm-time">${formatTime(post.createdAt)}</div>

                  <div class="rm-actions">
                    <button class="rm-mini-btn" data-action="like">${liked ? "取消赞" : "点赞"}</button>
                    <button class="rm-mini-btn" data-action="comment">评论</button>
                    <button class="rm-mini-btn" data-action="delete">删除</button>
                  </div>

                  ${socialBox}

                  <div class="rm-comment-form">
                    <input class="rm-comment-input" placeholder="写评论...">
                    <button class="rm-mini-btn" data-action="send-comment">发送</button>
                  </div>
                </div>
              </div>
            `;
          }).join("");

          feedEl.querySelectorAll(".rm-post").forEach((postEl) => {
            const postId = postEl.getAttribute("data-post-id");
            const post = posts.find((p) => p.id === postId);
            if (!post) return;

            const likeBtn = postEl.querySelector('[data-action="like"]');
            const commentBtn = postEl.querySelector('[data-action="comment"]');
            const sendCommentBtn = postEl.querySelector('[data-action="send-comment"]');
            const deleteBtn = postEl.querySelector('[data-action="delete"]');

            likeBtn.onclick = async () => {
              post.likes = post.likes || [];

              if (post.likes.includes("me")) {
                post.likes = post.likes.filter((x) => x !== "me");
              } else {
                post.likes.push("me");
              }

              await savePosts();
              renderFeed();
            };

            commentBtn.onclick = () => {
              const form = postEl.querySelector(".rm-comment-form");
              const input = postEl.querySelector(".rm-comment-input");
              form.classList.toggle("show");
              input.focus();
            };

            sendCommentBtn.onclick = async () => {
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

            deleteBtn.onclick = async () => {
              const ok = await roche.ui.confirm({
                title: "删除朋友圈",
                message: "确定删除这条朋友圈吗？"
              });

              if (!ok) return;

              posts = posts.filter((p) => p.id !== postId);
              await savePosts();
              renderFeed();
            };
          });
        }

        async function getRecentContext(charFull, limit) {
          if (!limit || !charFull || !charFull.conversationId) return [];

          try {
            const messages = await roche.memory.getShortTerm({
              conversationId: charFull.conversationId,
              limit: limit
            });

            return Array.isArray(messages) ? messages : [];
          } catch (err) {
            return [];
          }
        }

        function compactContext(messages) {
          if (!messages || messages.length === 0) return "无";

          return messages.map((m) => {
            const name = m.senderHandle || m.senderName || m.senderId || "未知";
            const text = m.text || m.content || "";
            return `${name}: ${text}`;
          }).filter(Boolean).join("\n");
        }

        async function createAIPost(options) {
          const charId = options && options.charId ? options.charId : characterSelect.value;
          const idea = options && options.idea ? options.idea : postIdea.value.trim();
          const isAuto = options && options.isAuto;

          const char = getCharById(charId);
          if (!char) {
            statusEl.textContent = "请先选择角色。";
            return;
          }

          generateBtn.disabled = true;

          try {
            statusEl.textContent = isAuto
              ? "自动发布触发中，正在生成朋友圈..."
              : "AI 正在生成朋友圈，这一步会消耗 Roche 当前 AI 配置的 API/token...";

            const charFull = await roche.character.get(char.id);
            const charName = getDisplayName(charFull);
            const userName = getDisplayName(userPersona);

            const contextLimit = Number(contextLimitSelect.value || settings.contextLimit || 0);
            const recentMessages = await getRecentContext(charFull, contextLimit);
            const recentContext = compactContext(recentMessages);

            const charPersona = charFull.persona || charFull.bio || charFull.description || "";
            const userText = userPersona
              ? (userPersona.persona || userPersona.bio || userPersona.description || "")
              : "";

            const prompt = `
你要代替角色写一条“微信朋友圈”，像角色本人随手发的动态。

【角色】
名字：${charName}
人设：
${charPersona}

【用户】
名字：${userName}
人设：
${userText}

【最近聊天上下文】
${recentContext}

【用户额外要求】
${idea || "没有额外要求。请根据角色状态、最近聊天和人设自由发挥。"}

【输出要求】
- 只输出朋友圈正文，不要解释。
- 中文输出。
- 像真实朋友圈，不要像作文、公告、任务总结。
- 可以短，可以嘴硬，可以吐槽，可以含蓄，不要太端着。
- 不要过度煽情，不要鸡汤。
- 不要写“朋友圈：”。
- 不要使用标题。
- 1 到 4 句话即可。
- 如果最近聊天里有值得提的事，可以自然带一点；没有就写日常状态。
            `.trim();

            const result = await roche.ai.chat({
              messages: [{ role: "user", content: prompt }],
              temperature: 0.85
            });

            const text = result && result.text ? result.text.trim() : "";

            if (!text) {
              statusEl.textContent = "AI 没有返回内容。";
              return;
            }

            let sticker = "";
            const imageMode = imageModeSelect.value || settings.imageMode || "none";
            if (imageMode === "sticker") {
              sticker = randomItem(stickerPool);
            }

            posts.unshift({
              id: uid(),
              authorId: charFull.id,
              authorName: charName,
              avatar: getAvatar(charFull),
              text,
              sticker,
              likes: [],
              comments: [],
              createdAt: Date.now(),
              source: isAuto ? "auto" : "manual-ai"
            });

            if (!isAuto) postIdea.value = "";

            await savePosts();
            renderFeed();

            settings.lastAutoPostAt = isAuto ? Date.now() : settings.lastAutoPostAt;
            await saveSettings();

            statusEl.textContent = isAuto ? "角色自动发了一条朋友圈。" : "角色已发布朋友圈。";
          } catch (err) {
            statusEl.textContent = "生成失败：" + (err && err.message ? err.message : err);
          } finally {
            generateBtn.disabled = false;
          }
        }

        function setupAutoTimer() {
          if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
          }

          const minutes = Number(settings.autoMinutes || 0);
          if (!minutes) return;

          autoTimer = setInterval(async () => {
            const now = Date.now();
            const gap = minutes * 60 * 1000;
            const last = Number(settings.lastAutoPostAt || 0);

            if (now - last < gap) return;
            if (!settings.characterId && !characterSelect.value) return;

            await createAIPost({
              charId: settings.characterId || characterSelect.value,
              idea: "",
              isAuto: true
            });
          }, 60 * 1000);
        }

        async function loadInitialData() {
          try {
            statusEl.textContent = "正在读取角色、用户和朋友圈...";

            userPersona = await roche.persona.getActiveUserPersona();
            characters = await roche.character.list();

            posts = (await roche.storage.get("moments_posts_v2")) || [];
            settings = (await roche.storage.get("moments_settings_v2")) || settings;

            userNameEl.textContent = getDisplayName(userPersona);
            userAvatarEl.src = getAvatar(userPersona);

            if (!characters || characters.length === 0) {
              characterSelect.innerHTML = `<option value="">没有读取到角色</option>`;
            } else {
              characterSelect.innerHTML = characters.map((char) => {
                return `<option value="${escapeHtml(char.id)}">${escapeHtml(getDisplayName(char))}</option>`;
              }).join("");
            }

            if (settings.characterId) characterSelect.value = settings.characterId;
            contextLimitSelect.value = String(settings.contextLimit || 50);
            imageModeSelect.value = settings.imageMode || "sticker";
            autoModeSelect.value = String(settings.autoMinutes || 0);

            statusEl.textContent = "准备好了。自动发布只在此页面打开时运行。";
            renderFeed();
            setupAutoTimer();
          } catch (err) {
            statusEl.textContent = "初始化失败：" + (err && err.message ? err.message : err);
          }
        }

        characterSelect.onchange = persistSettingsFromUI;
        contextLimitSelect.onchange = persistSettingsFromUI;
        imageModeSelect.onchange = persistSettingsFromUI;
        autoModeSelect.onchange = persistSettingsFromUI;

        generateBtn.onclick = async () => {
          await persistSettingsFromUI();
          await createAIPost({ isAuto: false });
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

          let sticker = "";
          const imageMode = imageModeSelect.value || settings.imageMode || "none";
          if (imageMode === "sticker") {
            sticker = randomItem(stickerPool);
          }

          posts.unshift({
            id: uid(),
            authorId: char.id,
            authorName: getDisplayName(char),
            avatar: getAvatar(char),
            text,
            sticker,
            likes: [],
            comments: [],
            createdAt: Date.now(),
            source: "manual"
          });

          postIdea.value = "";
          await savePosts();
          renderFeed();
          statusEl.textContent = "已发布。";
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

        this.__cleanup = () => {
          if (autoTimer) clearInterval(autoTimer);
        };
      },
      async unmount(container, roche) {
        if (this.__cleanup) this.__cleanup();
        container.replaceChildren();
      }
    }
  ]
});

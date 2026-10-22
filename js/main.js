/**
 * PHÂN HÓA GIÀU NGHÈO TRONG KINH TẾ THỊ TRƯỜNG TƯ BẢN CHỦ NGHĨA
 * Logic tương tác & mô phỏng lý thuyết Mác - Lênin
 * Bộ môn MLN122 - Nhóm 07 - SE1913
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollNav();
  initTooltips();
  initLedgerToggle();
  initWorkdaySimulator();
  initCycleNodes();
  initHoldingCalculator();
  initCitigroupTabs();
  initDonutChart();
  initQuiz();
  initReveal();
});

/* ================= 1. SCROLL NAV & PROGRESS ================= */
function initScrollNav() {
  const progress = document.getElementById("progressBar");
  const partLabel = document.getElementById("currentPartLabel");
  const drawer = document.getElementById("tocDrawer");
  const openBtn = document.getElementById("openTocBtn");
  const closeBtn = document.getElementById("closeTocBtn");
  const backdrop = document.getElementById("drawerBackdrop");
  const toTop = document.getElementById("toTopBtn");
  const drawerLinks = document.querySelectorAll(".drawer__list a");

  // Toggle Drawer
  if (openBtn) openBtn.addEventListener("click", () => drawer.classList.add("open"));
  if (closeBtn) closeBtn.addEventListener("click", () => drawer.classList.remove("open"));
  if (backdrop) backdrop.addEventListener("click", () => drawer.classList.remove("open"));
  drawerLinks.forEach((a) => {
    a.addEventListener("click", () => drawer.classList.remove("open"));
  });

  // Track sections for current Part label
  const sections = [
    { id: "hero", label: "Môn học MLN122 · Nhóm 07 · SE1913" },
    { id: "phan1", label: "Phần 1: Khởi nguồn từ Cơ chế Thị trường & Quy luật Cạnh tranh" },
    { id: "phan2", label: "Phần 2: Gốc rễ Bản chất – Hàng hóa Sức Lao động & Giá trị Thặng dư" },
    { id: "phan3", label: "Phần 3: Động lực Trực tiếp – Tích lũy Tư bản & Quy luật Bần cùng hóa" },
    { id: "phan4", label: "Phần 4: Nấc thang Độc quyền & Phân hóa Toàn cầu (Citigroup)" },
    { id: "phan5", label: "Phần 5: Nguyên nhân Sâu xa, Thực tiễn & Bài học Việt Nam" },
    { id: "quiz", label: "Kiểm tra kiến thức MLN122" },
    { id: "tailieu", label: "Tài liệu tham khảo & Kết luận" }
  ];

  let lastPart = "";

  window.addEventListener("scroll", () => {
    const sTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (sTop / docH) * 100 : 0;
    if (progress) progress.style.width = pct + "%";

    if (toTop) {
      if (sTop > 400) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }

    // Determine current section
    let current = sections[0].label;
    let activeId = "hero";
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          current = s.label;
          activeId = s.id;
        }
      }
    }

    if (partLabel && current !== lastPart) {
      lastPart = current;
      partLabel.classList.add("swap");
      setTimeout(() => {
        partLabel.textContent = current;
        partLabel.classList.remove("swap");
      }, 150);
    }

    drawerLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "#" + activeId) link.classList.add("active");
      else link.classList.remove("active");
    });
  });

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ================= 2. TOOLTIP CHO CÔNG THỨC G = c + (v + m) ================= */
function initTooltips() {
  const tips = {
    c: "<b>c (Tư bản bất biến):</b> Máy móc, thiết bị, nhà xưởng, nguyên nhiên vật liệu. Giá trị của chúng chỉ được <em>chuyển dịch bảo toàn</em> vào sản phẩm qua lao động cụ thể, <strong>không tự sinh ra giá trị mới</strong>.",
    v: "<b>v (Tư bản khả biến):</b> Bộ phận tư bản dùng để <em>mua hàng hóa sức lao động</em>. Trong quá trình sản xuất biến đổi về số lượng thông qua lao động trừu tượng, tạo ra giá trị mới lớn hơn giá trị bản thân nó.",
    m: "<b>m (Giá trị thặng dư):</b> Bộ phận giá trị mới dôi ra ngoài giá trị sức lao động, do công nhân tạo ra nhưng bị nhà tư bản chiếm đoạt không bồi hoàn do nắm quyền sở hữu tư liệu sản xuất.",
    G: "<b>G (Giá trị hàng hóa):</b> Tổng giá trị kết tinh trong hàng hóa = Lao động quá khứ (c) + Lao động sống mới tạo ra (v + m)."
  };

  const tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip";
  document.body.appendChild(tooltipEl);

  const targets = document.querySelectorAll("[data-tip]");
  targets.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const key = el.getAttribute("data-tip");
      if (tips[key]) {
        tooltipEl.innerHTML = tips[key];
        tooltipEl.classList.add("show");
        positionTooltip(e);
      }
    });
    el.addEventListener("mousemove", positionTooltip);
    el.addEventListener("mouseleave", () => {
      tooltipEl.classList.remove("show");
    });
  });

  function positionTooltip(e) {
    const x = e.clientX;
    const y = e.clientY;
    const w = tooltipEl.offsetWidth || 220;
    const h = tooltipEl.offsetHeight || 80;
    let left = x - w / 2;
    let top = y - h - 14;
    if (left < 10) left = 10;
    if (left + w > window.innerWidth - 10) left = window.innerWidth - w - 10;
    if (top < 10) top = y + 20;
    tooltipEl.style.left = left + "px";
    tooltipEl.style.top = top + "px";
  }
}

/* ================= 3. TOGGLE VÍ DỤ KÉO SỢI 4H VS 8H ================= */
function initLedgerToggle() {
  const btn4 = document.getElementById("btnYarn4h");
  const btn8 = document.getElementById("btnYarn8h");
  const resEl = document.getElementById("yarnResultText");
  const appEl = document.getElementById("yarnApplication");
  const revEl = document.getElementById("yarnRevenue");
  const matEl = document.getElementById("yarnCotton");
  const wearEl = document.getElementById("yarnDeprec");
  const wageEl = document.getElementById("yarnWage");
  const totalCostEl = document.getElementById("yarnTotalCost");

  if (!btn4 || !btn8) return;

  function setYarn(hours) {
    if (hours === 4) {
      btn4.classList.add("on");
      btn8.classList.remove("on");
      if (matEl) matEl.textContent = "50 USD (50kg bông)";
      if (wearEl) wearEl.textContent = "3 USD (hao mòn máy)";
      if (wageEl) wageEl.textContent = "15 USD (mua SLĐ cả ngày)";
      if (totalCostEl) totalCostEl.textContent = "68 USD";
      if (revEl) revEl.textContent = "68 USD (50kg sợi)";
      if (resEl) {
        resEl.textContent = "68 USD (Thu về) − 68 USD (Ứng trước) = 0 USD (Chưa có giá trị thặng dư m)";
        resEl.classList.remove("win");
      }
      if (appEl) {
        appEl.innerHTML = "Nếu dừng ở mốc 4 giờ: Nhà tư bản chỉ thu hồi đúng số vốn ứng trước. <em>Tiền chưa trở thành tư bản</em> vì chưa tạo ra giá trị gia tăng.";
      }
    } else {
      btn8.classList.add("on");
      btn4.classList.remove("on");
      if (matEl) matEl.textContent = "100 USD (100kg bông)";
      if (wearEl) wearEl.textContent = "6 USD (hao mòn máy)";
      if (wageEl) wageEl.textContent = "15 USD (tiền công đã khoán 8h)";
      if (totalCostEl) totalCostEl.textContent = "121 USD";
      if (revEl) revEl.textContent = "136 USD (100kg sợi)";
      if (resEl) {
        resEl.textContent = "136 USD (Thu về) − 121 USD (Ứng trước) = +15 USD GIÁ TRỊ THẶNG DƯ (m)";
        resEl.classList.add("win");
      }
      if (appEl) {
        appEl.innerHTML = "Sau 8 giờ: Bằng việc bắt công nhân làm thêm 4 giờ thặng dư mà không trả thêm tiền công, nhà tư bản chiếm đoạt trọn vẹn <strong>15 USD m</strong> (tỷ suất m' = 100%).";
      }
    }
  }

  btn4.addEventListener("click", () => setYarn(4));
  btn8.addEventListener("click", () => setYarn(8));
}

/* ================= 4. MÔ PHỎNG NGÀY LAO ĐỘNG ================= */
function initWorkdaySimulator() {
  const rangeWork = document.getElementById("rangeWorkday");
  const rangeNec = document.getElementById("rangeNecessary");
  const outWork = document.getElementById("outWorkday");
  const outNec = document.getElementById("outNecessary");
  const necBar = document.getElementById("daybarNec");
  const surBar = document.getElementById("daybarSur");
  const statSurHour = document.getElementById("statSurHour");
  const statRate = document.getElementById("statRate");
  const statMass = document.getElementById("statMass");
  const simNote = document.getElementById("simNote");

  if (!rangeWork || !rangeNec) return;

  function update() {
    let w = parseFloat(rangeWork.value);
    let n = parseFloat(rangeNec.value);

    // Ensure necessary <= workday
    if (n >= w) {
      n = Math.max(1, w - 0.5);
      rangeNec.value = n;
    }

    outWork.textContent = w + "h";
    outNec.textContent = n + "h";

    const s = w - n;
    const rate = Math.round((s / n) * 100);

    // Assuming standard factory of 100 workers, 10 USD/h
    const mass = Math.round(s * 10 * 100);

    const necPct = (n / w) * 100;
    const surPct = (s / w) * 100;

    necBar.style.width = necPct + "%";
    surBar.style.width = surPct + "%";

    necBar.innerHTML = `<span>Tất yếu: <strong>${n}h</strong> (${Math.round(necPct)}%)</span>`;
    surBar.innerHTML = `<span>Thặng dư: <strong>${s}h</strong> (${Math.round(surPct)}%)</span>`;

    if (statSurHour) statSurHour.textContent = s.toFixed(1) + " giờ";
    if (statRate) statRate.textContent = rate + "%";
    if (statMass) statMass.textContent = mass.toLocaleString("vi-VN") + " USD";

    // Explanatory note
    if (simNote) {
      if (w > 8 && n === 4) {
        simNote.innerHTML = `Phương pháp <strong>Sản xuất Giá trị Thặng dư Tuyệt đối</strong>: Kéo dài ngày lao động từ 8h lên ${w}h trong khi thời gian tất yếu giữ nguyên (${n}h). Tỷ suất bóc lột tăng vọt lên <strong>${rate}%</strong>!`;
      } else if (w === 8 && n < 4) {
        simNote.innerHTML = `Phương pháp <strong>Sản xuất Giá trị Thặng dư Tương đối</strong>: Độ dài ngày làm việc vẫn là 8h, nhưng nhờ tăng năng suất lao động xã hội, thời gian bù đắp tư liệu sinh hoạt rút xuống còn <strong>${n}h</strong>, thời gian thặng dư mở rộng lên <strong>${s}h</strong> (m' = <strong>${rate}%</strong>).`;
      } else if (w > 8 && n < 4) {
        simNote.innerHTML = `Kết hợp cả hai phương pháp (Tuyệt đối + Tương đối): Cừa kéo dài ngày làm việc lên ${w}h vừa ứng dụng công nghệ rút ngắn thời gian tất yếu còn ${n}h. Đây là mô hình bóc lột tối đa trong giai đoạn đại công nghiệp.`;
      } else {
        simNote.innerHTML = `Mô hình chuẩn thời C. Mác: Ngày làm việc 8 giờ, chia đều <strong>4 giờ tất yếu</strong> (trả công bằng giá trị sức lao động) và <strong>4 giờ thặng dư</strong> cho nhà tư bản (m' = 100%).`;
      }
    }
  }

  rangeWork.addEventListener("input", update);
  rangeNec.addEventListener("input", update);

  // Preset buttons
  const presets = document.querySelectorAll("[data-preset]");
  presets.forEach((btn) => {
    btn.addEventListener("click", () => {
      presets.forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const mode = btn.getAttribute("data-preset");
      if (mode === "standard") {
        rangeWork.value = 8;
        rangeNec.value = 4;
      } else if (mode === "absolute") {
        rangeWork.value = 11;
        rangeNec.value = 4;
      } else if (mode === "relative") {
        rangeWork.value = 8;
        rangeNec.value = 2;
      } else if (mode === "tech") {
        rangeWork.value = 10;
        rangeNec.value = 1.5;
      }
      update();
    });
  });

  update();
}

/* ================= 5. VÒNG LẶP TÍCH LŨY TƯ BẢN ================= */
function initCycleNodes() {
  const nodes = document.querySelectorAll(".cycle__node");
  const infoEl = document.getElementById("cycleInfoBox");
  if (!nodes.length || !infoEl) return;

  const desc = {
    n1: {
      title: "1. Chiếm đoạt Giá trị Thặng dư (m)",
      content: "Nhà tư bản thu về giá trị thặng dư m do lao động không công của công nhân tạo ra. Thay vì tiêu dùng cá nhân toàn bộ, một phần lớn được giữ lại để 'tư bản hóa'."
    },
    n2: {
      title: "2. Chuyển hóa thành Tư bản Phụ thêm",
      content: "Giá trị thặng dư được rót ngược lại vào quá trình sản xuất: mở rộng nhà xưởng, mua sắm máy móc hiện đại (c) và thuê thêm nhân công (v)."
    },
    n3: {
      title: "3. Tăng Cấu tạo Hữu cơ (c/v)",
      content: "Dưới áp lực cạnh tranh, tư bản máy móc (c) tăng nhanh hơn tư bản sức lao động (v). c/v tăng làm giảm cầu về lao động sống, tạo ra nạn thừa nhân khẩu (thất nghiệp)."
    },
    n4: {
      title: "4. Tích tụ & Tập trung Tư bản",
      content: "Quy mô doanh nghiệp phình to thông qua tư bản hóa (tích tụ) và thâu tóm, sáp nhập đối thủ nhỏ lẻ (tập trung), mở đường chuyển từ tự do cạnh tranh sang ĐỘC QUYỀN."
    }
  };

  nodes.forEach((n) => {
    n.addEventListener("click", () => {
      nodes.forEach((x) => x.classList.remove("on"));
      n.classList.add("on");
      const id = n.dataset.node;
      if (desc[id]) {
        infoEl.innerHTML = `<strong>${desc[id].title}</strong><p style="margin:6px 0 0; color:var(--muted);">${desc[id].content}</p>`;
      }
    });
  });
}

/* ================= 6. MÔ PHỎNG CHẾ ĐỘ THAM DỰ ================= */
function initHoldingCalculator() {
  const rangeShare = document.getElementById("rangeShare");
  const rangeSubs = document.getElementById("rangeSubs");
  const outShare = document.getElementById("outShare");
  const outSubs = document.getElementById("outSubs");
  const outRatio = document.getElementById("outMultRatio");
  const outTotalCap = document.getElementById("outTotalCap");
  const tierSubs = document.getElementById("tierSubs");
  const tierGrand = document.getElementById("tierGrand");

  if (!rangeShare || !rangeSubs) return;

  function update() {
    const s = parseInt(rangeShare.value); // percentage, e.g., 51%
    const n = parseInt(rangeSubs.value); // number of subs per parent, e.g., 3

    outShare.textContent = s + "%";
    outSubs.textContent = n + " công ty";

    // Mathematical multiplier:
    // To control 100 capital of grand-sub, parent only needs:
    // Mother owns s% of Sub, Sub owns s% of Grand.
    // Capital ratio = (s/100) * (s/100) = (s*s)/10000.
    // Leverage multiplier = 10000 / (s*s)
    const factor = (s / 100) * (s / 100);
    const mult = (1 / factor).toFixed(1);
    const bossCapNeeded = Math.round(100 * factor);

    if (outRatio) outRatio.textContent = mult + " lần";
    if (outTotalCap) {
      outTotalCap.textContent = `Chỉ cần ${bossCapNeeded} đv vốn để điều khiển 100 đv vốn cháu`;
    }

    // Render tree nodes
    if (tierSubs) {
      tierSubs.innerHTML = "";
      for (let i = 1; i <= n; i++) {
        const c = document.createElement("div");
        c.className = "co";
        c.innerHTML = `Cty Con ${i}<small>Mẹ giữ ${s}%</small>`;
        tierSubs.appendChild(c);
      }
    }

    if (tierGrand) {
      tierGrand.innerHTML = "";
      const totalGrand = Math.min(n * n, 9);
      for (let j = 1; j <= totalGrand; j++) {
        const g = document.createElement("div");
        g.className = "co";
        g.style.background = "var(--navy)";
        g.innerHTML = `Cháu ${j}<small>Con giữ ${s}%</small>`;
        tierGrand.appendChild(g);
      }
    }
  }

  rangeShare.addEventListener("input", update);
  rangeSubs.addEventListener("input", update);
  update();
}

/* ================= 7. CITIGROUP 4 NẤC THANG TABS ================= */
function initCitigroupTabs() {
  const rungs = document.querySelectorAll(".rung");
  const tabBtns = document.querySelectorAll(".tabs__nav button");
  const panels = document.querySelectorAll(".tabs__panel");

  function switchTab(index) {
    tabBtns.forEach((b, i) => b.classList.toggle("on", i === index));
    panels.forEach((p, i) => p.classList.toggle("on", i === index));
    rungs.forEach((r, i) => r.classList.toggle("on", i === index));
  }

  rungs.forEach((rung) => {
    rung.addEventListener("click", () => {
      const idx = parseInt(rung.dataset.rung);
      switchTab(idx);
      const tabTarget = document.getElementById("citigroupTabsAnchor");
      if (tabTarget) tabTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  tabBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => switchTab(idx));
  });
}

/* ================= 8. BIỂU ĐỒ BẮC BÁN CẦU ================= */
function initDonutChart() {
  const circle = document.querySelector(".donut .fg");
  if (!circle) return;

  const totalLen = 2 * Math.PI * 54; // r=54 -> ~339.29
  circle.style.strokeDasharray = totalLen;
  circle.style.strokeDashoffset = totalLen; // start empty

  let animated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !animated) {
          animated = true;
          // Northern hemisphere holds 69% of global wealth
          const targetOffset = totalLen * (1 - 0.69);
          circle.style.strokeDashoffset = targetOffset;
        }
      });
    },
    { threshold: 0.4 }
  );

  const container = document.querySelector(".donut-wrap");
  if (container) observer.observe(container);
}

/* ================= 9. BÀI TEST TRẮC NGHIỆM MLN122 (20 CÂU HỎI) ================= */
function initQuiz() {
  const quizData = [
    {
      q: "1. Khuyết tật nội tại nào của kinh tế thị trường là nguồn gốc dẫn đến phân hóa giàu nghèo và bất bình đẳng xã hội?",
      opts: [
        "A. Thị trường tự động phân bổ nguồn lực công bằng và đảm bảo phúc lợi ngang nhau cho tất cả mọi người",
        "B. Phân phối thu nhập theo mức độ sở hữu tư liệu sản xuất và vị thế cạnh tranh; thị trường không tự khắc phục được phân hóa thu nhập và cơ hội",
        "C. Thị trường loại bỏ hoàn toàn cạnh tranh và triệt tiêu mọi rủi ro phá sản",
        "D. Thị trường tự động cân đối cung cầu lao động mà không bao giờ xuất hiện nạn thất nghiệp"
      ],
      correct: 1,
      explain: "Phân hóa giàu nghèo không phải hiện tượng ngẫu nhiên mà là khuyết tật có tính quy luật nội tại của KTTT khi thiếu vắng sự điều tiết vì cộng đồng, do lợi ích phân bổ theo mức độ sở hữu và vị trí tham gia thị trường."
    },
    {
      q: "2. Trong sản xuất hàng hóa giản đơn, quy luật giá trị dẫn đến sự phân hóa những người sản xuất như thế nào?",
      opts: [
        "A. Mọi người sản xuất đều đạt mức lợi nhuận ngang nhau nhờ nguyên tắc trao đổi ngang giá",
        "B. Người có hao phí lao động cá biệt nhỏ hơn hao phí lao động xã hội cần thiết sẽ giàu lên; người có hao phí cá biệt lớn hơn sẽ thua lỗ, phá sản và bần cùng hóa",
        "C. Người nào bán hàng với giá đắt nhất sẽ luôn là người chiến thắng lâu dài trên thị trường",
        "D. Nhà nước can thiệp chia đều của cải cho tất cả các hộ nông dân và thợ thủ công"
      ],
      correct: 1,
      explain: "Quy luật giá trị buộc người sản xuất bán theo giá trị xã hội. Ai có điều kiện tốt, năng suất cao thì giàu lên trở thành nhà tư bản; ai rủi ro, năng suất thấp thì phá sản, biến thành người làm thuê."
    },
    {
      q: "3. Theo học thuyết C. Mác, sức lao động trở thành hàng hóa khi thỏa mãn đồng thời hai điều kiện lịch sử nào?",
      opts: [
        "A. Người lao động có bằng đại học và ký hợp đồng lao động vô thời hạn",
        "B. Người lao động được tự do về thân thể và bị tước đoạt hết tư liệu sản xuất, buộc phải bán sức lao động để sinh sống",
        "C. Người lao động sở hữu nhiều nhà xưởng và có vốn tích lũy sẵn sàng thuê mướn thêm người khác",
        "D. Xã hội bắt đầu sử dụng tiền tệ bằng kim loại quý thay thế hàng đổi hàng"
      ],
      correct: 1,
      explain: "Hai điều kiện quyết định: (1) Tự do về thân thể để có quyền bán sức lao động như một hàng hóa; (2) Không có tư liệu sản xuất để tự nuôi sống mình, buộc phải đi làm thuê cho nhà tư bản."
    },
    {
      q: "4. Điểm khác biệt căn bản nhất giữa hàng hóa sức lao động với các hàng hóa thông thường khác là gì?",
      opts: [
        "A. Hàng hóa sức lao động có thể tích trữ trong kho qua nhiều năm mà không hao mòn giá trị",
        "B. Giá trị sử dụng của hàng hóa sức lao động khi tiêu dùng có khả năng sáng tạo ra một lượng giá trị mới lớn hơn giá trị bản thân nó",
        "C. Giá trị của hàng hóa sức lao động hoàn toàn không phụ thuộc vào giá cả các tư liệu sinh hoạt",
        "D. Hàng hóa sức lao động có thể tự nhân đôi số lượng mà không cần quá trình tiêu dùng"
      ],
      correct: 1,
      explain: "Đây là chìa khóa giải quyết mâu thuẫn công thức chung của tư bản: Giá trị sử dụng của sức lao động có đặc tính là nguồn gốc sinh ra giá trị mới (v + m) lớn hơn giá trị bản thân nó (v)."
    },
    {
      q: "5. Việc C. Mác phân chia tư bản thành 'Tư bản bất biến' (c) và 'Tư bản khả biến' (v) dựa trên căn cứ khoa học nào?",
      opts: [
        "A. Dựa vào tốc độ chu chuyển nhanh hay chậm của các bộ phận tư bản trong lưu thông",
        "B. Dựa vào hình thức tồn tại bằng hiện vật là máy móc nhà xưởng hay tiền mặt lưu động",
        "C. Dựa vào vai trò khác nhau của từng bộ phận tư bản trong quá trình sản xuất ra giá trị thặng dư",
        "D. Dựa vào thời gian sử dụng tài sản trên hay dưới một chu kỳ kế toán năm"
      ],
      correct: 2,
      explain: "Tư bản bất biến (c) chỉ bảo tồn và chuyển dịch giá trị cũ vào sản phẩm. Duy nhất tư bản khả biến (v) dùng mua sức lao động mới tạo ra giá trị mới và làm tăng thêm giá trị (sinh ra giá trị thặng dư m)."
    },
    {
      q: "6. Trong công thức cấu thành giá trị hàng hóa G = c + (v + m), bộ phận nào đại diện cho 'giá trị mới' do lao động sống tạo ra?",
      opts: [
        "A. Toàn bộ công thức G = c + v + m",
        "B. Chỉ có bộ phận tư bản bất biến (c)",
        "C. Bộ phận (v + m) bao gồm giá trị bù đắp sức lao động và giá trị thặng dư",
        "D. Chỉ có phần hao mòn và khấu hao máy móc nhà xưởng"
      ],
      correct: 2,
      explain: "Bộ phận c là giá trị cũ của tư liệu sản xuất chuyển vào sản phẩm mới. Bộ phận (v + m) là giá trị mới hoàn toàn do hao phí lao động sống của người công nhân kết tinh trong quá trình sản xuất."
    },
    {
      q: "7. Bản chất kinh tế của 'Tiền công' dưới chủ nghĩa tư bản là gì?",
      opts: [
        "A. Là giá cả của toàn bộ lao động mà người công nhân đã bỏ ra trong cả ngày làm việc",
        "B. Là lòng hảo tâm và sự trợ cấp an sinh xã hội của chủ doanh nghiệp dành cho người nghèo",
        "C. Là giá cả của hàng hóa sức lao động, nhưng bị biểu hiện bề ngoài thành giá cả của lao động để che giấu bóc lột",
        "D. Là phần chia đều lợi nhuận kinh doanh sau khi doanh nghiệp đã hoàn thành nghĩa vụ thuế"
      ],
      correct: 2,
      explain: "Tiền công thực chất là giá cả của hàng hóa sức lao động. Nhưng hình thức trả theo giờ/sản phẩm tạo ảo tưởng rằng toàn bộ ngày làm việc đều được trả công, xóa nhòa ranh giới lao động thặng dư không công."
    },
    {
      q: "8. Ngày làm việc của công nhân được chia thành 2 phần: 4 giờ đầu bù đắp giá trị tiền lương, 4 giờ sau tạo ra giá trị thuộc về ai?",
      opts: [
        "A. Thời gian lao động tất yếu, giá trị tạo ra thuộc về công nhân mang về nhà",
        "B. Thời gian nghỉ ngơi kỹ thuật, không tạo ra bất kỳ giá trị mới nào",
        "C. Thời gian lao động thặng dư, tạo ra giá trị thặng dư (m) bị nhà tư bản chiếm đoạt không hoàn lại",
        "D. Thời gian đóng góp bắt buộc cho quỹ bảo hiểm của các tổ chức quốc tế"
      ],
      correct: 2,
      explain: "Ngày lao động gồm: Thời gian lao động tất yếu (tạo giá trị ngang bằng v) và Thời gian lao động thặng dư (tạo ra m mà nhà tư bản chiếm đoạt, là nguồn gốc tích lũy sự giàu có của giai cấp tư sản)."
    },
    {
      q: "9. Phương pháp sản xuất giá trị thặng dư tương đối được thực hiện thông qua con đường nào sau đây?",
      opts: [
        "A. Tuyệt đối kéo dài độ dài ngày lao động vượt quá 12 đến 16 giờ trong khi thời gian tất yếu không đổi",
        "B. Rút ngắn thời gian lao động tất yếu bằng cách hạ thấp giá trị sức lao động nhờ tăng năng suất lao động xã hội trong các ngành sản xuất tư liệu sinh hoạt",
        "C. Cắt giảm hoàn toàn tiền lương danh nghĩa của công nhân xuống mức 0 đồng",
        "D. Tăng cường độ lao động thuần túy bằng mệnh lệnh hành chính mà không cải tiến máy móc"
      ],
      correct: 1,
      explain: "Giá trị thặng dư tương đối đạt được khi độ dài ngày lao động không đổi, nhưng nhờ tăng năng suất lao động xã hội làm rẻ hóa tư liệu sinh hoạt, do đó rút ngắn thời gian tất yếu và kéo dài thời gian thặng dư."
    },
    {
      q: "10. Bản chất kinh tế của quá trình 'Tích lũy tư bản' là gì?",
      opts: [
        "A. Là sự tích trữ tiền tệ của cá nhân người tiêu dùng vào két sắt hoặc gửi tiết kiệm",
        "B. Là việc chuyển hóa một phần giá trị thặng dư trở lại thành tư bản phụ thêm nhằm tái sản xuất mở rộng",
        "C. Là việc ngân sách nhà nước in thêm tiền để tài trợ xây dựng hạ tầng công cộng",
        "D. Là sự quyên góp của các quỹ từ thiện xã hội để xóa đói giảm nghèo"
      ],
      correct: 1,
      explain: "Nguồn gốc duy nhất của tích lũy tư bản là giá trị thặng dư. Nhà tư bản trích một phần m biến thành tư bản phụ thêm (mua thêm tư liệu sản xuất c và thuê thêm nhân công v) để tiếp tục bóc lột nhiều m hơn."
    },
    {
      q: "11. Khi khoa học - công nghệ phát triển, cấu tạo hữu cơ của tư bản (c/v) biến động theo xu hướng nào và gây ra hệ quả gì?",
      opts: [
        "A. Tỷ lệ c/v giảm xuống, nhu cầu tuyển dụng công nhân lao động phổ thông tăng đột biến",
        "B. Tỷ lệ c/v có xu hướng ngày càng tăng, máy móc thay thế con người làm nhu cầu tương đối về sức lao động giảm, sinh ra đội quân thất nghiệp thường trực",
        "C. Tỷ lệ c/v giữ nguyên bất biến qua mọi cuộc cách mạng công nghiệp",
        "D. Tỷ lệ c/v chỉ tăng khi tiền lương của công nhân tăng gấp đôi so với trước"
      ],
      correct: 1,
      explain: "Tiến bộ kỹ thuật làm tư bản bất biến (c) tăng nhanh hơn tư bản khả biến (v), tỷ lệ c/v tăng lên. Quy mô thu hút lao động sống giảm tương đối so với tổng tư bản, tạo nên 'đội quân thất nghiệp công nghiệp'."
    },
    {
      q: "12. Quy luật chung của tích lũy tư bản do C. Mác phát hiện đã chỉ ra sự tích lũy ở hai cực đối lập như thế nào?",
      opts: [
        "A. Cả hai giai cấp tư sản và công nhân đều cùng giàu lên nhanh chóng như nhau",
        "B. Tích lũy của cải, tư bản và sự giàu sang ở cực giai cấp tư sản đi kèm với tích lũy bần cùng, thất nghiệp và bấp bênh ở cực giai cấp vô sản",
        "C. Người lao động làm thuê ngày càng sở hữu nhiều cổ phần chi phối hơn giới chủ",
        "D. Mọi mâu thuẫn xã hội đều tự động biến mất khi tổng sản phẩm xã hội tăng trưởng"
      ],
      correct: 1,
      explain: "C. Mác khẳng định: Sự tích lũy của cải ở một cực (giai cấp tư sản) đồng thời là sự tích lũy sự bần cùng, nỗi thống khổ của lao động, sự bấp bênh và lệ thuộc ở cực đối lập (giai cấp công nhân làm thuê)."
    },
    {
      q: "13. Hiện tượng 'Bần cùng hóa tương đối' của giai cấp công nhân dưới CNTB được hiểu chính xác là gì?",
      opts: [
        "A. Mức sống vật chất của người công nhân bị tụt hậu hoàn toàn so với thời kỳ đồ đá",
        "B. Tỷ phần thu nhập của giai cấp công nhân trong tổng thu nhập quốc dân có xu hướng giảm sút so với tỷ phần mà giai cấp tư sản chiếm đoạt",
        "C. Tất cả mọi công nhân đều rơi vào cảnh vô gia cư và mất hoàn toàn khả năng mua sắm",
        "D. Tiền lương thực tế của người lao động luôn luôn bị giảm xuống 0 đồng"
      ],
      correct: 1,
      explain: "Bần cùng hóa tương đối phản ánh: dù mức sống vật chất tuyệt đối có thể tăng lên nhờ năng suất cao, nhưng khoảng cách giữa thu nhập của công nhân với khối của cải khổng lồ của nhà tư bản ngày càng bị nới rộng."
    },
    {
      q: "14. Trình tự phát triển lịch sử của chủ nghĩa tư bản từ thế kỷ XIX đến nay trải qua 4 nấc thang độc quyền nào?",
      opts: [
        "A. Độc quyền phong kiến → Độc quyền phường hội → Hợp tác xã → Kinh tế thị trường tự do",
        "B. Độc quyền tư nhân → Tài phiệt tài chính & Chế độ tham dự → Độc quyền nhà nước → Độc quyền xuyên quốc gia (toàn cầu hóa)",
        "C. Độc quyền nhà nước → Độc quyền tư nhân → Cạnh tranh tự do hoàn hảo → Bao cấp",
        "D. Độc quyền thương nghiệp → Độc quyền tiểu thủ công → Tự cung tự cấp → Phường hội"
      ],
      correct: 1,
      explain: "Bốn nấc thang phát triển: (1) Độc quyền tư nhân (thâu tóm cạnh tranh) → (2) Tài phiệt tài chính (chế độ tham dự) → (3) Độc quyền nhà nước (nhà nước bảo lãnh/cứu trợ) → (4) Độc quyền xuyên quốc gia (TNCs toàn cầu)."
    },
    {
      q: "15. Cơ chế 'Chế độ tham dự' (Holding System) giúp các tập đoàn tài phiệt tài chính chi phối nền kinh tế dựa trên nguyên lý nào?",
      opts: [
        "A. Phải dùng tiền mặt mua đứt 100% tất cả cổ phần của mọi doanh nghiệp trong nền kinh tế",
        "B. Chỉ cần sở hữu tỷ lệ cổ phần khống chế ở công ty mẹ, công ty mẹ khống chế công ty con, rồi công ty con khống chế công ty cháu, tạo đòn bẩy thao túng lượng vốn khổng lồ gấp bội",
        "C. Dựa vào việc ngân hàng trung ương cho vay không hoàn lại vô điều kiện",
        "D. Do người lao động tự nguyện giao nộp toàn bộ quyền biểu quyết trọn đời"
      ],
      correct: 1,
      explain: "Nhờ cấu trúc kim tự tháp, tài phiệt chỉ cần một lượng tư bản nhỏ nắm cổ phần chi phối ở đỉnh tháp công ty mẹ là có thể kiểm soát và điều khiển lượng vốn xã hội khổng lồ gấp 4 đến 10 lần ở các nhánh dưới."
    },
    {
      q: "16. Sự can thiệp giải cứu của Nhà nước Mỹ (bơm 45 tỷ USD vốn và bảo lãnh hơn 301 tỷ USD cho Citigroup năm 2008) phản ánh bản chất gì của Độc quyền nhà nước?",
      opts: [
        "A. Nhà nước tư sản hành động hoàn toàn vô tư vì lợi ích của tầng lớp người lao động nghèo",
        "B. Sức mạnh độc quyền tư nhân kết hợp với sức mạnh bộ máy nhà nước, dùng ngân sách và tiền thuế của nhân dân gánh rủi ro để bảo toàn thế đứng cho tư bản tài phiệt",
        "C. Nhà nước tư sản đang tiến hành xóa bỏ vĩnh viễn chế độ tư hữu và xóa bỏ tập đoàn tài chính",
        "D. Nhà nước bắt buộc các ngân hàng phải đem toàn bộ lợi nhuận phát đều cho người thất nghiệp"
      ],
      correct: 1,
      explain: "Độc quyền nhà nước là sự cộng sinh quyền lực giữa các tập đoàn độc quyền với bộ máy nhà nước. Khi khủng hoảng xảy ra, nhà nước đứng ra 'xã hội hóa tổn thất' (dùng tiền thuế cứu trợ) nhưng 'tư nhân hóa lợi nhuận'."
    },
    {
      q: "17. Báo cáo của tổ chức quốc tế Oxfam (2025/2026) ghi nhận thực trạng bất bình đẳng nổi bật nào trong kinh tế thị trường toàn cầu?",
      opts: [
        "A. 99% dân số nghèo nhất thế giới đang sở hữu toàn bộ các tập đoàn công nghệ lớn nhất",
        "B. Tài sản của nhóm tỷ phú giàu nhất tăng vọt hàng ngàn tỷ USD nhờ độc quyền và tài chính, trong khi hàng tỷ người lao động đối mặt khủng hoảng chi phí sinh hoạt và nghèo đói",
        "C. Thu nhập của mọi người dân ở các quốc gia đang phát triển đã ngang bằng với các nước G7",
        "D. Không còn bất kỳ sự bóc lột nào trong chuỗi cung ứng hàng hóa xuyên biên giới"
      ],
      correct: 1,
      explain: "Báo cáo Oxfam cho thấy sự tích tụ của cải cực đoan: các tập đoàn độc quyền xuyên quốc gia và giới siêu giàu gia tăng tài sản kỷ lục, trong khi hàng tỷ người lao động chịu cảnh tiền lương thực tế sụt giảm."
    },
    {
      q: "18. Mâu thuẫn kinh tế cơ bản của phương thức sản xuất tư bản chủ nghĩa, nguồn gốc sâu xa của phân hóa giàu nghèo là gì?",
      opts: [
        "A. Mâu thuẫn giữa việc thiếu hụt máy móc hiện đại và thừa thãi tài nguyên thiên nhiên",
        "B. Mâu thuẫn giữa tính chất xã hội hóa ngày càng cao của lực lượng sản xuất với chế độ chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất",
        "C. Mâu thuẫn giữa nhu cầu tiêu thụ hàng xa xỉ và khả năng sản xuất hàng hóa bình dân",
        "D. Mâu thuẫn kỹ thuật giữa tiền mặt truyền thống và thẻ thanh toán điện tử"
      ],
      correct: 1,
      explain: "Đây là mâu thuẫn cơ bản của CNTB: Quá trình sản xuất mang tính xã hội hóa cao độ (hàng triệu lao động cùng liên kết), nhưng tư liệu sản xuất và thành quả của cải lại bị thiểu số nhà tư bản chiếm đoạt tư nhân."
    },
    {
      q: "19. Nền kinh tế thị trường định hướng XHCN ở Việt Nam có nguyên tắc cốt lõi nào để khắc phục khuyết tật phân hóa giàu nghèo của CNTB?",
      opts: [
        "A. Quay trở lại chế độ bao cấp toàn diện và cấm đoán hoàn toàn các thành phần kinh tế tư nhân",
        "B. Gắn tăng trưởng kinh tế với tiến bộ và công bằng xã hội; thực hiện tiến bộ và công bằng xã hội ngay trong từng bước, từng chính sách; không 'hy sinh' công bằng xã hội để chạy theo tăng trưởng đơn thuần",
        "C. Đợi đến khi nền kinh tế đạt mức phát triển cực cao như phương Tây rồi mới thực hiện an sinh xã hội",
        "D. Cào bằng mọi mức thu nhập bất kể trình độ và năng suất lao động"
      ],
      correct: 1,
      explain: "Giáo trình Kinh tế chính trị Mác - Lênin (tr. 166-167) khẳng định: Phát triển vì con người, gắn tăng trưởng kinh tế với tiến bộ và công bằng xã hội ngay trong từng chính sách, không đánh đổi công bằng xã hội lấy tăng trưởng kinh tế đơn thuần."
    },
    {
      q: "20. Mục tiêu tổng quát và chuẩn mực định hướng xã hội chủ nghĩa trong phát triển kinh tế ở Việt Nam được đúc kết là gì?",
      opts: [
        "A. Tối đa hóa lợi nhuận của các tập đoàn tài phiệt bất động sản và ngân hàng thương mại",
        "B. 'Dân giàu, nước mạnh, dân chủ, công bằng, văn minh'",
        "C. Phấn đấu trở thành quốc gia có số lượng tỷ phú đô la nhiều nhất khu vực Đông Nam Á",
        "D. Xóa bỏ nền kinh tế nhiều thành phần để chỉ duy trì một hình thức sở hữu duy nhất"
      ],
      correct: 1,
      explain: "Định hướng XHCN lấy mục tiêu 'Dân giàu, nước mạnh, dân chủ, công bằng, văn minh' làm chuẩn mực xuyên suốt, bảo đảm mọi thành quả phát triển đều hướng về phục vụ con người và nhân dân lao động."
    }
  ];

  let currentIdx = 0;
  let score = 0;
  let answered = false;
  const userAnswers = []; // Lưu lại lịch sử lựa chọn cho cả 20 câu

  const countEl = document.getElementById("quizCount");
  const scoreEl = document.getElementById("quizScore");
  const barEl = document.getElementById("quizBarInner");
  const qEl = document.getElementById("quizQuestion");
  const optsEl = document.getElementById("quizOptions");
  const expEl = document.getElementById("quizExplain");
  const nextBtn = document.getElementById("quizNextBtn");
  const cardEl = document.getElementById("quizCard");

  if (!qEl || !optsEl || !cardEl) return;

  function renderQuestion() {
    answered = false;
    const cur = quizData[currentIdx];
    countEl.textContent = `Câu ${currentIdx + 1} / ${quizData.length}`;
    scoreEl.textContent = `Điểm: ${score}/${quizData.length}`;
    barEl.style.width = ((currentIdx) / quizData.length) * 100 + "%";

    qEl.textContent = cur.q;
    optsEl.innerHTML = "";
    expEl.classList.remove("show");
    expEl.innerHTML = "";
    nextBtn.style.display = "none";

    cur.opts.forEach((optText, i) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      const letter = ["A", "B", "C", "D"][i];
      btn.innerHTML = `<i>${letter}</i><span>${optText.replace(/^[A-D]\.\s*/, "")}</span>`;
      btn.addEventListener("click", () => handleAnswer(i, btn));
      optsEl.appendChild(btn);
    });
  }

  function handleAnswer(choiceIdx, btnEl) {
    if (answered) return;
    answered = true;
    const cur = quizData[currentIdx];
    const isCorrect = choiceIdx === cur.correct;
    const allBtns = optsEl.querySelectorAll(".opt");
    allBtns.forEach((b) => (b.disabled = true));

    // Lưu lại câu trả lời vào danh sách lịch sử
    userAnswers[currentIdx] = {
      qIndex: currentIdx + 1,
      question: cur.q,
      userChoice: choiceIdx,
      correctChoice: cur.correct,
      isCorrect: isCorrect,
      choiceText: cur.opts[choiceIdx],
      correctText: cur.opts[cur.correct],
      explain: cur.explain
    };

    if (isCorrect) {
      score++;
      btnEl.classList.add("ok");
      expEl.innerHTML = `<strong>Chính xác! 🎉</strong><br>${cur.explain}`;
    } else {
      btnEl.classList.add("bad");
      allBtns[cur.correct].classList.add("ok");
      expEl.innerHTML = `<strong>Chưa đúng!</strong><br>${cur.explain}`;
    }

    scoreEl.textContent = `Điểm: ${score}/${quizData.length}`;
    expEl.classList.add("show");

    if (currentIdx < quizData.length - 1) {
      nextBtn.style.display = "inline-flex";
      nextBtn.textContent = "Câu tiếp theo →";
    } else {
      nextBtn.style.display = "inline-flex";
      nextBtn.textContent = "Xem kết quả bài thi →";
    }
  }

  nextBtn.addEventListener("click", () => {
    if (currentIdx < quizData.length - 1) {
      currentIdx++;
      renderQuestion();
    } else {
      showSummary();
    }
  });

  function showSummary() {
    barEl.style.width = "100%";
    const totalQ = quizData.length;
    const correctCount = score;
    const wrongCount = totalQ - score;
    const pct = Math.round((correctCount / totalQ) * 100);

    let rankTitle = "";
    let rankDesc = "";
    if (correctCount >= 18) {
      rankTitle = "🏆 Xuất sắc! Nắm vững toàn diện kiến thức MLN122";
      rankDesc = "Bạn đã hiểu rất sâu sắc và mạch lạc về khuyết tật KTTT, quy luật giá trị thặng dư, quy luật bần cùng hóa, 4 nấc thang độc quyền và định hướng XHCN tại Việt Nam.";
    } else if (correctCount >= 15) {
      rankTitle = "🥇 Giỏi! Nắm chắc các nguyên lý cốt lõi";
      rankDesc = "Kết quả rất tốt! Bạn đã hiểu đúng hầu hết các phạm trù trọng tâm và các luận điểm kinh tế chính trị quan trọng.";
    } else if (correctCount >= 10) {
      rankTitle = "🥈 Khá! Cần củng cố thêm các phân tích chuyên sâu";
      rankDesc = "Bạn đã có nền tảng cơ bản tốt, hãy đọc thêm phần cấu tạo hữu cơ c/v, chế độ tham dự và báo cáo Oxfam để hiểu rõ hơn bản chất.";
    } else {
      rankTitle = "📚 Cần ôn tập kỹ hơn các chương trong Giáo trình";
      rankDesc = "Khuyên bạn nên xem lại sơ đồ luồng giá trị G = c + (v+m) và 4 nấc thang Citigroup trên website để nắm vững bài học.";
    }

    cardEl.innerHTML = `
      <div class="quiz__done">
        <div class="ring">${pct}%</div>
        <h3 style="font-size:1.65rem; margin:14px 0 6px; color:var(--navy); line-height:1.25;">
          ${rankTitle}
        </h3>
        <p style="color:var(--muted); font-size:1rem; max-width:680px; margin:0 auto 16px;">
          ${rankDesc}
        </p>

        <!-- BẢNG THỐNG KÊ ĐÚNG / SAI -->
        <div class="quiz__stats">
          <div class="quiz__stat correct">
            <span class="num">${correctCount} / ${totalQ}</span>
            <small>✅ Số câu ĐÚNG</small>
          </div>
          <div class="quiz__stat wrong">
            <span class="num">${wrongCount} / ${totalQ}</span>
            <small>❌ Số câu SAI</small>
          </div>
          <div class="quiz__stat total">
            <span class="num">${pct}%</span>
            <small>🎯 Tỷ lệ chính xác</small>
          </div>
        </div>

        <!-- Ô NHẬP TÊN ĐỂ XUẤT BÁO CÁO -->
        <div class="quiz__user-input">
          <label for="quizStudentName">
            <strong>👤 Nhập Họ và Tên / Mã số sinh viên (để in vào báo cáo):</strong>
          </label>
          <input type="text" id="quizStudentName" placeholder="Ví dụ: Nguyễn Văn A - SE1913" value="Sinh viên MLN122 - SE1913" />
        </div>

        <!-- CÁC NÚT THAO TÁC -->
        <div class="quiz__actions">
          <button id="quizDownloadBtn" class="btn btn--red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px; height:18px; margin-right:6px;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Tải kết quả về máy (.PDF)
          </button>

          <button id="quizPrintBtn" class="btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px; height:18px; margin-right:6px;">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            In / Xem trước (Print)
          </button>

          <button id="quizRestartBtn" class="btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px; height:18px; margin-right:6px;">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Làm lại bài kiểm tra
          </button>
        </div>

        <!-- KHU VỰC XEM LẠI CHI TIẾT 20 CÂU HỎI -->
        <div class="quiz__review">
          <div class="quiz__review-title">
            <span>Chi tiết bài làm (20 câu hỏi)</span>
            <button class="quiz__review-toggle" id="quizReviewToggle">Thu gọn / Mở rộng</button>
          </div>
          <div class="quiz__review-list" id="quizReviewList">
            ${userAnswers
              .map(
                (item) => `
              <div class="quiz__review-item ${item.isCorrect ? "is-correct" : "is-wrong"}">
                <div class="quiz__review-q">
                  <strong>Câu ${item.qIndex}:</strong> ${item.question}
                </div>
                <div class="quiz__review-meta">
                  <div>
                    <span class="tag-ans ${item.isCorrect ? "ok" : "bad"}">
                      ${item.isCorrect ? "✅ ĐÚNG" : "❌ SAI"}
                    </span>
                    <strong>Bạn chọn:</strong> ${item.choiceText}
                  </div>
                  ${
                    !item.isCorrect
                      ? `<div style="margin-top:4px; color:#2f8a5b;">
                          <strong>Đáp án đúng:</strong> ${item.correctText}
                        </div>`
                      : ""
                  }
                  <div class="explain-text">
                    <strong>Giải thích:</strong> ${item.explain}
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    // 1. Nút Tải file kết quả PDF (.PDF)
    const dlBtn = document.getElementById("quizDownloadBtn");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        const studentNameInput = document.getElementById("quizStudentName");
        const studentName = studentNameInput ? studentNameInput.value : "Sinh viên MLN122";
        downloadQuizReportPDF(studentName, correctCount, wrongCount, pct, userAnswers, rankTitle, rankDesc, dlBtn);
      });
    }

    // 2. Nút In / Xem trước
    const printBtn = document.getElementById("quizPrintBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // 3. Nút Làm lại bài kiểm tra
    const restartBtn = document.getElementById("quizRestartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        currentIdx = 0;
        score = 0;
        userAnswers.length = 0;
        // Khôi phục giao diện câu hỏi gốc
        cardEl.innerHTML = `
          <div class="quiz__top">
            <span class="quiz__count" id="quizCount">Câu 1 / ${quizData.length}</span>
            <span class="quiz__score" id="quizScore">Điểm: 0/${quizData.length}</span>
          </div>
          <div class="quiz__bar">
            <i id="quizBarInner"></i>
          </div>
          <div class="quiz__q" id="quizQuestion">Đang tải câu hỏi...</div>
          <div class="quiz__opts" id="quizOptions"></div>
          <div class="quiz__explain" id="quizExplain"></div>
          <div class="quiz__nav">
            <button class="btn btn--red" id="quizNextBtn" style="display:none;">Câu tiếp theo &rarr;</button>
          </div>
        `;
        initQuiz();
      });
    }

    // 4. Toggle danh sách xem lại câu hỏi
    const toggleBtn = document.getElementById("quizReviewToggle");
    const reviewList = document.getElementById("quizReviewList");
    if (toggleBtn && reviewList) {
      toggleBtn.addEventListener("click", () => {
        if (reviewList.style.display === "none") {
          reviewList.style.display = "grid";
          toggleBtn.textContent = "Thu gọn";
        } else {
          reviewList.style.display = "none";
          toggleBtn.textContent = "Mở rộng";
        }
      });
    }
  }

  // Hàm xuất file báo cáo PDF chất lượng cao tải về máy
  function downloadQuizReportPDF(studentName, correctCount, wrongCount, pct, answers, rankTitle, rankDesc, btnEl) {
    const originalBtnContent = btnEl ? btnEl.innerHTML : "";
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px; height:18px; margin-right:6px; animation:spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10"/>
        </svg>
        Đang tạo file PDF...
      `;
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const safeFilename = (studentName.trim() || "SinhVien")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    // Tạo modal hiển thị tài liệu PDF trực tiếp trên màn hình để html2canvas kết xuất chính xác 100%
    const modalWrapper = document.createElement("div");
    modalWrapper.id = "pdfModalOverlay";
    modalWrapper.style.position = "fixed";
    modalWrapper.style.inset = "0";
    modalWrapper.style.zIndex = "999999";
    modalWrapper.style.backgroundColor = "rgba(10, 25, 47, 0.88)";
    modalWrapper.style.backdropFilter = "blur(8px)";
    modalWrapper.style.display = "flex";
    modalWrapper.style.flexDirection = "column";
    modalWrapper.style.alignItems = "center";
    modalWrapper.style.justifyContent = "flex-start";
    modalWrapper.style.overflowY = "auto";
    modalWrapper.style.padding = "35px 15px";

    const notifyBar = document.createElement("div");
    notifyBar.style.color = "#ffffff";
    notifyBar.style.fontFamily = "'Montserrat', sans-serif";
    notifyBar.style.fontSize = "15px";
    notifyBar.style.fontWeight = "700";
    notifyBar.style.marginBottom = "18px";
    notifyBar.style.textAlign = "center";
    notifyBar.style.padding = "10px 24px";
    notifyBar.style.background = "#c92a2a";
    notifyBar.style.borderRadius = "8px";
    notifyBar.style.boxShadow = "0 4px 18px rgba(0,0,0,0.3)";
    notifyBar.innerHTML = "⏳ Đang kết xuất và tải tệp PDF... Vui lòng đợi trong giây lát!";

    const pdfContainer = document.createElement("div");
    pdfContainer.id = "pdfRenderWrapper";
    pdfContainer.style.width = "780px";
    pdfContainer.style.maxWidth = "100%";
    pdfContainer.style.background = "#ffffff";
    pdfContainer.style.color = "#1e293b";
    pdfContainer.style.fontFamily = "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif";
    pdfContainer.style.padding = "30px 34px";
    pdfContainer.style.boxSizing = "border-box";
    pdfContainer.style.lineHeight = "1.45";
    pdfContainer.style.borderRadius = "8px";
    pdfContainer.style.boxShadow = "0 8px 30px rgba(0,0,0,0.35)";

    pdfContainer.innerHTML = `
      <!-- HEADER PDF -->
      <div style="border-bottom: 2px solid #0f2b48; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #475569; letter-spacing: 0.05em;">
          <div>BỘ GIÁO DỤC VÀ ĐÀO TẠO &bull; ĐẠI HỌC FPT<br><span style="color:#c92a2a;">BỘ MÔN LÝ LUẬN CHÍNH TRỊ</span></div>
          <div style="text-align: right;">MÔN HỌC: MLN122<br>LỚP: SE1913 &bull; NHÓM 07</div>
        </div>
        <div style="text-align: center; margin-top: 14px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f2b48; text-transform: uppercase; letter-spacing: 0.04em;">
            PHIẾU ĐÁNH GIÁ KẾT QUẢ BÀI KIỂM TRA TRẮC NGHIỆM
          </h1>
          <p style="margin: 4px 0 0; font-size: 13px; font-weight: 700; color: #c92a2a; text-transform: uppercase;">
            Chuyên đề: Phân Hóa Giàu Nghèo Trong Nền Kinh Tế Thị Trường Tư Bản Chủ Nghĩa
          </p>
        </div>
      </div>

      <!-- THÔNG TIN THÍ SINH & THỜI GIAN -->
      <div style="display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 12.5px; margin-bottom: 14px;">
        <div>
          <strong>Họ và tên thí sinh:</strong> <span style="color:#0f2b48; font-weight:700; font-size:13px;">${studentName.trim() || "Sinh viên MLN122"}</span>
        </div>
        <div>
          <strong>Thời gian nộp bài:</strong> <span style="color:#475569;">${dateFormatted}</span>
        </div>
      </div>

      <!-- BẢNG TỔNG KẾT ĐIỂM SỐ -->
      <div style="display: flex; gap: 10px; margin-bottom: 14px;">
        <div style="flex: 1; border: 1.5px solid #2f8a5b; background: #f0fdf4; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">Số câu trả lời ĐÚNG</div>
          <div style="font-size: 22px; font-weight: 800; color: #2f8a5b; margin-top: 2px;">${correctCount} / 20 câu</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #c92a2a; background: #fef2f2; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 700; color: #991b1b; text-transform: uppercase;">Số câu trả lời SAI</div>
          <div style="font-size: 22px; font-weight: 800; color: #c92a2a; margin-top: 2px;">${wrongCount} / 20 câu</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #0f2b48; background: #eef2ff; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 700; color: #1e3a8a; text-transform: uppercase;">Tỷ lệ chính xác</div>
          <div style="font-size: 22px; font-weight: 800; color: #0f2b48; margin-top: 2px;">${pct}%</div>
        </div>
      </div>

      <!-- XẾP LOẠI NĂNG LỰC -->
      <div style="border-left: 4px solid #0f2b48; background: #f8fafc; padding: 8px 12px; margin-bottom: 18px; font-size: 12px;">
        <strong style="color:#0f2b48; font-size:12.5px;">Đánh giá học thuật:</strong> ${rankTitle} &bull; <em>${rankDesc}</em>
      </div>

      <!-- DANH SÁCH 20 CÂU HỎI -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 12px;">
        <h2 style="font-size: 13.5px; font-weight: 800; color: #0f2b48; text-transform: uppercase; margin: 0 0 10px;">
          BẢNG CHI TIẾT 20 CÂU HỎI & ĐÁP ÁN BÀI LÀM:
        </h2>
        <div>
          ${answers
            .map(
              (item) => `
            <div style="margin-bottom: 9px; padding: 8px 10px; border-radius: 6px; border: 1px solid ${item.isCorrect ? "#bbf7d0" : "#fecaca"}; background: ${item.isCorrect ? "#ffffff" : "#fffaf9"}; font-size: 11.5px; page-break-inside: avoid;">
              <div style="font-weight: 700; color: #0f2b48; margin-bottom: 3px; line-height: 1.35;">
                Câu ${item.qIndex}: ${item.question}
              </div>
              <div style="margin-bottom: 2px;">
                <span style="display:inline-block; padding: 1px 6px; border-radius: 3px; font-weight: 700; font-size: 10.5px; color: #fff; background: ${item.isCorrect ? "#2f8a5b" : "#c92a2a"};">
                  ${item.isCorrect ? "ĐÚNG" : "SAI"}
                </span>
                <strong style="margin-left: 4px;">Bạn đã chọn:</strong> <span>${item.choiceText}</span>
              </div>
              ${
                !item.isCorrect
                  ? `<div style="color: #2f8a5b; font-weight: 700; margin-bottom: 2px;">
                      &rarr; Đáp án đúng: ${item.correctText}
                    </div>`
                  : ""
              }
              <div style="color: #64748b; font-size: 11px; margin-top: 3px; border-top: 1px dotted #e2e8f0; padding-top: 3px; line-height: 1.35;">
                <strong>Giải thích lý luận:</strong> ${item.explain}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- FOOTER PDF -->
      <div style="margin-top: 16px; border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; font-size: 10.5px; color: #64748b;">
        <div>Nguồn đối chiếu: Giáo trình Kinh tế Chính trị Mác - Lênin (Bộ GD&ĐT 2021)</div>
        <div>Sản phẩm sáng tạo học phần MLN122 - Nhóm 07 (Lớp SE1913)</div>
      </div>
    `;

    modalWrapper.appendChild(notifyBar);
    modalWrapper.appendChild(pdfContainer);
    document.body.appendChild(modalWrapper);

    const opt = {
      margin: [8, 8, 10, 8],
      filename: `Ket_Qua_Kiem_Tra_MLN122_${safeFilename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };

    if (window.html2pdf) {
      window.html2pdf()
        .set(opt)
        .from(pdfContainer)
        .save()
        .then(() => {
          setTimeout(() => {
            modalWrapper.remove();
            if (btnEl) {
              btnEl.disabled = false;
              btnEl.innerHTML = originalBtnContent;
            }
          }, 800);
        })
        .catch((err) => {
          console.error("Lỗi xuất PDF:", err);
          modalWrapper.remove();
          if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = originalBtnContent;
          }
          window.print();
        });
    } else {
      modalWrapper.remove();
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = originalBtnContent;
      }
      window.print();
    }
  }

  renderQuestion();
}

/* ================= 10. SCROLL REVEAL ANIMATIONS ================= */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((it) => observer.observe(it));
}

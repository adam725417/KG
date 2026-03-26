/**
 * Knowledge Graph 教學課程資料結構
 * 每個 chapter 包含多個 scenes，每個 scene 包含完整的教學內容
 */

export const courseData = {
  title: 'Knowledge Graph 與 GraphRAG',
  subtitle: '從圖結構到語言模型的落地應用',
  description: '本課程以動畫互動方式，引導工業工程碩士生理解知識圖譜的核心概念、適用情境，以及與大型語言模型結合的 GraphRAG 架構。',
  instructor: '',
  totalScenes: 14,

  chapters: [
    {
      id: 'ch1',
      title: '從表格世界到關係世界',
      subtitle: '為什麼 Knowledge Graph 會出現',
      color: '#38bdf8',
      icon: 'Table',
      scenes: [
        {
          id: 'sc1-1',
          chapterId: 'ch1',
          title: '三張表的世界',
          objective: '理解傳統關聯式資料庫如何儲存疾病、藥物、飲食資料，以及 JOIN 查詢的運作方式',
          narration: '一開始，我們常用表格來儲存資料。像是疾病資料一張表、藥物一張表、飲食一張表。這種方式很適合保存結構化資料，但當我們想追問「某種疾病搭配某種藥物時，哪些食物要避免」時，表格之間的關聯就開始變得複雜。JOIN 查詢必須把三張表串在一起，而真實世界的問題往往需要更多層的連接。',
          keyPoints: [
            '關聯式資料庫用「表格 + JOIN」來表達不同資料之間的關係',
            '單表查詢效率高，但跨表關係越多，查詢複雜度就越高',
            '當關係本身就是問題的核心時，表格結構開始力不從心',
          ],
          teacherNotes: '可以引導學生思考：他們在課堂上學過的 SQL JOIN 操作，在 2 張表、3 張表、5 張表時的差異。這裡的關鍵不是批評 SQL，而是讓學生感受到「關係的增加」帶來的複雜度。',
          animationSteps: 4,
          quiz: [
            {
              id: 'q1-1-1',
              question: '當需要同時查詢「疾病」、「藥物」、「飲食」三張表的資料時，關聯式資料庫需要使用什麼操作？',
              options: ['GROUP BY', 'JOIN', 'UNION', 'DISTINCT'],
              answer: 1,
              explanation: 'JOIN 操作用於合併多張表的資料。但當 JOIN 的表越多、關係越複雜，查詢語句和執行效率都會受到影響。',
            },
            {
              id: 'q1-1-2',
              question: '以下哪個情境，傳統表格資料庫「最」不適合？',
              options: [
                '記錄每個月的銷售數字',
                '追蹤病人、疾病、藥物、食物之間的多層關係',
                '儲存員工基本資料',
                '計算商品庫存',
              ],
              answer: 1,
              explanation: '當問題核心是「多層關係的追蹤與推理」時，圖資料庫比表格更直觀、更有效率。',
            },
          ],
        },
        {
          id: 'sc1-2',
          chapterId: 'ch1',
          title: '問題開始變複雜',
          objective: '感受多實體、多步關係查詢帶來的複雜度爆炸，理解為什麼需要新的思維模式',
          narration: '當問題只是在問單一欄位時，表格很好用。但當問題需要跨越疾病、藥物、食物，甚至病人的個人條件時，我們其實是在問「關係」，而不是只在問「資料值」。每增加一個問題維度，就需要多做一次跨表連結，複雜度呈倍數成長。這就是為什麼真實世界的醫療資訊系統，很難只靠 SQL 處理所有情境。',
          keyPoints: [
            '多實體問題 = 多層 JOIN，複雜度快速升高',
            '真實世界的難題往往是多實體、多關係、多步推理',
            '「關係本身」才是問題的核心，而非單一欄位的值',
          ],
          teacherNotes: '這裡可以讓學生實際嘗試：「如果要用 SQL 回答這三個問題，要寫幾個 JOIN？」讓他們感受複雜度的增長是具體的。',
          animationSteps: 5,
          quiz: [
            {
              id: 'q1-2-1',
              question: '「糖尿病患者服用 Metformin，同時有高血壓，晚餐應避免哪些食物？」這個問題涉及幾種不同的實體？',
              options: ['2 種（疾病、藥物）', '3 種（疾病、藥物、食物）', '4 種（病人、疾病、藥物、食物）', '5 種以上'],
              answer: 2,
              explanation: '這個問題涉及 4 種實體類型：病人（Patient）、疾病（Disease，糖尿病和高血壓都屬於同一個 Disease 節點類型）、藥物（Drug）、食物（Food）。雖然有兩個疾病實例，但它們都是 :Disease 類型的節點，需要多層關係串聯才能完整回答。',
            },
          ],
        },
        {
          id: 'sc1-3',
          chapterId: 'ch1',
          title: '資料變成圖',
          objective: '觀察表格如何「解構」並重組為知識圖譜，理解節點與關係的直覺意義',
          narration: '如果我們把資料看成一個個角色，把它們之間的關係直接畫出來，問題就變得更自然了。表格中的每一列記錄，變成了圖中的一個節點；原本隱藏在 JOIN 條件裡的關聯，變成了明確可見的有向邊。這就是 Knowledge Graph 的核心精神：不只是記錄資料，而是把關係顯性化、可操作化。',
          keyPoints: [
            'Knowledge Graph 把表格中的「隱性關係」轉化為「顯性邊」',
            '節點 = 實體（疾病、藥物、食物、病人）',
            '邊 = 語意關係（TREATS、SHOULD_AVOID、INTERACTS_WITH）',
            '圖結構讓多步推理可以沿著邊走，而不是靠多層 JOIN',
          ],
          teacherNotes: '重點是讓學生理解：圖不是把表格資料丟掉，而是把關係「解放」出來，讓它成為一等公民。可以問學生：「你覺得這樣的結構，在查詢多步關係時，比 SQL 更直觀嗎？」',
          animationSteps: 5,
          quiz: [
            {
              id: 'q1-3-1',
              question: '在 Knowledge Graph 中，原本 SQL 中的 JOIN 條件，在圖中對應到什麼？',
              options: ['節點（Node）', '屬性（Property）', '關係邊（Relationship）', '標籤（Label）'],
              answer: 2,
              explanation: '原本 JOIN 條件中隱含的關聯，在 Knowledge Graph 中變成明確的有向關係邊（Relationship），讓關係成為一等公民而非查詢的副產品。',
            },
          ],
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Knowledge Graph 的三大核心',
      subtitle: '建立 Node、Relationship、Property 的直覺',
      color: '#a855f7',
      icon: 'GitMerge',
      scenes: [
        {
          id: 'sc2-1',
          chapterId: 'ch2',
          title: 'Node 是什麼',
          objective: '理解 Node（節點）的概念：知識世界中的實體角色',
          narration: 'Node，也就是節點，可以理解成知識世界中的角色。疾病、藥物、食物、病人，這些都可以是節點。每個節點有它的「標籤」來說明它是哪種類型的實體，也有它獨有的「屬性」來描述細節。在知識圖譜中，節點不只是一筆資料，而是一個有身份、有特質、能與其他角色建立關係的實體。',
          keyPoints: [
            'Node = 實體（Entity），是知識圖譜的基本單位',
            '每個 Node 有一或多個「Label」來表示它的類型',
            '例如：(:Disease)、(:Drug)、(:Food)、(:Patient)',
            '同一個圖中可以有多種不同類型的 Node 並存',
          ],
          teacherNotes: '可類比為物件導向程式設計中的「物件」。Label 就像 Class，Node 就像 Instance。這對工程系的學生來說很直觀。',
          animationSteps: 4,
          quiz: [
            {
              id: 'q2-1-1',
              question: '在 Knowledge Graph 中，「Metformin（二甲雙胍）」這個降血糖藥物，最適合對應哪種 Label？',
              options: ['(:Patient)', '(:Disease)', '(:Drug)', '(:Food)'],
              answer: 2,
              explanation: 'Metformin 是一種藥物，因此應該標記為 (:Drug)。在 Neo4j 的 Cypher 語法中，Node 的 Label 放在括號內，前面加冒號。',
            },
          ],
        },
        {
          id: 'sc2-2',
          chapterId: 'ch2',
          title: 'Relationship 是什麼',
          objective: '理解 Relationship（關係）如何定義節點之間的語意連結',
          narration: 'Relationship，也就是關係，是 Knowledge Graph 最關鍵的部分。因為知識往往不是存在單一資料點裡，而是存在「誰跟誰有什麼關係」裡。在圖資料庫中，關係是有方向性的有向邊，同時也有自己的名稱（Type）和屬性。例如「Metformin TREATS Diabetes」這條關係，不只告訴我們兩個實體相連，更告訴我們連結的語意是「治療」。',
          keyPoints: [
            'Relationship = 語意連結，有方向性（從誰到誰）',
            '關係有「類型」（Type），例如 TREATS、SHOULD_AVOID、INTERACTS_WITH',
            '一個關係連接兩個 Node：起點（Source）和終點（Target）',
            '關係可以有自己的「屬性」（Property），例如：evidenceLevel、note',
          ],
          teacherNotes: '強調「有向性」很重要：TREATS 是從藥物指向疾病，不是反過來。這在查詢時很關鍵。也可以讓學生想想：現實中的知識是不是「有方向的」——愛、治療、影響都是有方向的。',
          animationSteps: 5,
          quiz: [
            {
              id: 'q2-2-1',
              question: '在 Knowledge Graph 中，「高糖飲食 WORSENS 糖尿病」這條關係，起點（Source Node）是？',
              options: ['糖尿病', '高糖飲食', '病人', '都不是'],
              answer: 1,
              explanation: '關係的方向是「高糖飲食 → WORSENS → 糖尿病」，所以起點是「高糖飲食」，終點是「糖尿病」。',
            },
            {
              id: 'q2-2-2',
              question: '以下哪個選項最適合作為 Relationship 的「名稱/類型」（不是 Node 的 Label）？',
              options: ['Disease', 'TREATS', 'Metformin', 'Patient'],
              answer: 1,
              explanation: 'TREATS 是一個關係類型（Relationship Type），描述兩個實體之間的語意連結。慣例上關係類型用全大寫加底線書寫。',
            },
          ],
        },
        {
          id: 'sc2-3',
          chapterId: 'ch2',
          title: 'Property 是什麼',
          objective: '理解 Property（屬性）如何為節點和關係補充細節資訊',
          narration: 'Property，也就是屬性，是節點或關係身上的細節。節點定義「是誰」，關係定義「有什麼連結」，屬性則補充「細節是什麼」。例如一個藥物節點可以有：name（名稱）、dosage（劑量）、warningLevel（警示等級）等屬性。一條關係也可以有：evidenceLevel（証據等級）、note（備注）等屬性。Property 讓知識圖譜不只能描述結構，也能保留量化的細節資訊。',
          keyPoints: [
            'Property = 節點或關係的鍵值對（key-value pair）屬性',
            'Node Property 例子：name、dosage、description',
            'Relationship Property 例子：evidenceLevel、clinicalNote',
            'Property 讓知識圖譜同時具備結構（圖）和細節（屬性）',
          ],
          teacherNotes: '可以讓學生想想：如果是 SQL，屬性就是「欄位值」。圖資料庫的差別在於，它的 Property 是彈性的、不同節點可以有不同的 Property，不需要所有行都有同樣的欄位。這就是 schemaless 的彈性。',
          animationSteps: 4,
          quiz: [
            {
              id: 'q2-3-1',
              question: '若想記錄「Metformin TREATS Diabetes」這個關係的「臨床証據等級」，應該怎麼做？',
              options: [
                '新增一個獨立的 Node 來記錄証據等級',
                '把証據等級加在 Metformin 節點的屬性裡',
                '把証據等級加在 TREATS 這條關係的屬性裡',
                '知識圖譜無法記錄這類資訊',
              ],
              answer: 2,
              explanation: '証據等級是描述「這條治療關係」的細節，因此應該作為 TREATS 關係的 Property，而不是掛在任一個 Node 上。',
            },
          ],
        },
      ],
    },
    {
      id: 'ch3',
      title: '哪些問題適合用 Knowledge Graph',
      subtitle: '技術選型要看問題本質',
      color: '#22c55e',
      icon: 'Target',
      scenes: [
        {
          id: 'sc3-1',
          chapterId: 'ch3',
          title: '適合的問題',
          objective: '識別 Knowledge Graph 最能發揮優勢的問題類型',
          narration: '當問題需要跨很多種實體、走過多段關係，或需要知道答案是怎麼推來的，Knowledge Graph 特別有優勢。多實體關聯、多跳推理、關聯追蹤、可解釋查詢，這四種情境都是圖結構的強項。特別是在醫療、知識管理、供應鏈等領域，問題的本質往往就是「實體之間的複雜關係網路」。',
          keyPoints: [
            '多實體關聯：需要同時考慮多種不同類型的實體',
            '多跳推理：答案需要沿著多條邊推導才能得到',
            '關聯追蹤：需要找出誰影響了誰，影響路徑是什麼',
            '可解釋查詢：需要知道答案從哪條路徑推導而來',
          ],
          teacherNotes: '可以問學生：「你們研究的題目，有哪些問題是屬於多跳推理的？」這樣可以把抽象概念連結到他們自己的研究主題。',
          animationSteps: 4,
          quiz: [
            {
              id: 'q3-1-1',
              question: '以下哪個問題最適合用 Knowledge Graph 來回答？',
              options: [
                '今天賣出多少件商品？',
                '員工 A 的薪水是多少？',
                '糖尿病患者服用 Metformin 且同時有高血壓時，應避免哪些食物？',
                '倉庫目前還剩多少庫存？',
              ],
              answer: 2,
              explanation: '這個問題涉及多種實體（病人、疾病、藥物、食物）和多跳推理（病人→疾病→藥物→食物禁忌），正是 Knowledge Graph 的強項。其他選項都是簡單的單表查詢，用 SQL 更直接。',
            },
          ],
        },
        {
          id: 'sc3-2',
          chapterId: 'ch3',
          title: '不適合的問題',
          objective: '認識 Knowledge Graph 不是萬能的，學會選擇合適的技術',
          narration: '不是所有問題都該用圖。如果只是簡單的加總、統計、單表查詢，傳統資料庫反而更直接、更有效率。每月總銷售額、單表庫存查詢、簡單統計彙總，這些用 SQL 或 Excel 就能很好地解決。技術選型的關鍵不是「哪個技術更先進」，而是「哪個技術更適合這個問題的本質結構」。',
          keyPoints: [
            '簡單統計彙總（SUM、COUNT、AVG）：SQL 更直接高效',
            '單表查詢：不需要關係時，關聯式資料庫就足夠',
            '高頻率的批次更新：RDBMS 的 ACID 保證更穩定',
            '選擇技術要看問題本質，不是追流行',
          ],
          teacherNotes: '這是很重要的工程思維教育。可以強調：「每個工具都有其適合的場景。Graph 不是要取代 SQL，而是在特定問題上提供更好的解法。」',
          animationSteps: 4,
          quiz: [
            {
              id: 'q3-2-1',
              question: '以下哪個問題，用傳統 SQL 資料庫「最」適合？',
              options: [
                '找出所有與「阿斯匹靈」有交互作用的藥物，以及這些藥物治療的所有疾病',
                '計算今年第三季的總營業額',
                '追蹤一個病人在過去 5 年的就醫歷程和用藥關係',
                '找出供應鏈中，如果某家供應商斷鏈，會影響哪些產品的生產',
              ],
              answer: 1,
              explanation: '「計算今年第三季的總營業額」是簡單的聚合查詢，用 SQL 的 SUM + GROUP BY 就能高效完成。其他選項都涉及多層關係追蹤，更適合用 Knowledge Graph。',
            },
          ],
        },
      ],
    },
    {
      id: 'ch4',
      title: '疾病－用藥－飲食的大型案例',
      subtitle: '把抽象概念帶進真實應用',
      color: '#f59e0b',
      icon: 'Network',
      scenes: [
        {
          id: 'sc4-1',
          chapterId: 'ch4',
          title: '案例世界觀',
          objective: '建立完整的醫療知識圖譜世界觀，理解真實應用的多層次結構',
          narration: '在真實應用中，我們不是只處理單一疾病，而是要處理病人、疾病、用藥、食物、症狀、營養素之間的整體知識網路。每個節點都可以連接到很多其他節點，形成一個複雜但有結構的知識宇宙。這個網路不是混亂的，每條邊都有明確的語意，讓我們能沿著路徑做有意義的推理。',
          keyPoints: [
            '真實醫療知識圖譜包含：病人、疾病、藥物、食物、症狀、營養素等多種節點',
            '節點之間有豐富的語意關係：HAS_DISEASE、TAKES、TREATS、SHOULD_AVOID...',
            '圖結構可以自然地表達這種多層次、多維度的知識網路',
            '每條路徑都代表一條「推理鏈」',
          ],
          teacherNotes: '這裡可以讓學生想想：在工業工程的場景中，類似的多層次知識網路有哪些？例如製造流程、供應鏈、設備維護知識等。',
          animationSteps: 5,
          quiz: [
            {
              id: 'q4-1-1',
              question: '在醫療知識圖譜中，下列哪種關係最適合連接「病人」和「藥物」？',
              options: ['TREATS', 'HAS_DISEASE', 'TAKES', 'SHOULD_AVOID'],
              answer: 2,
              explanation: 'TAKES 表示「病人服用藥物」這個關係。TREATS 是藥物治療疾病，HAS_DISEASE 是病人有某疾病，SHOULD_AVOID 是疾病或藥物要避免某食物。',
            },
          ],
        },
        {
          id: 'sc4-2',
          chapterId: 'ch4',
          title: '共病與衝突',
          objective: '理解多個疾病同時存在時，Knowledge Graph 如何呈現相互衝突的限制',
          narration: '真實世界更複雜的地方在於，共病情境下，建議可能互相衝突。例如糖尿病需要控制碳水化合物，高血壓需要低鈉飲食，但某些低碳水化合物食品卻含高鈉。Knowledge Graph 能幫我們看到這些多重限制是如何交織在一起的，並讓醫療人員或 AI 系統察覺潛在衝突，而不是只給出片面建議。',
          keyPoints: [
            '共病（Comorbidity）：同一病人同時有多種疾病',
            '不同疾病對飲食的限制可能互相矛盾',
            'Knowledge Graph 能同時呈現所有限制和衝突點',
            '圖結構特別適合表達「多重約束下的衝突關係」',
          ],
          teacherNotes: '這是一個很好的「為什麼需要 Graph」的實例。可以問：「如果只用表格，要如何偵測共病衝突？需要寫多複雜的 SQL？」',
          animationSteps: 5,
          quiz: [
            {
              id: 'q4-2-1',
              question: '為什麼 Knowledge Graph 特別適合處理「共病情境下的飲食建議」？',
              options: [
                '因為 Graph 資料庫的查詢速度比 SQL 快',
                '因為 Graph 能同時呈現多種疾病的限制，並自然地發現衝突點',
                '因為 Graph 不需要維護 Schema',
                '因為 Graph 可以儲存更多資料',
              ],
              answer: 1,
              explanation: 'Graph 的優勢在於能同時追蹤多條路徑（多種疾病→各自的食物禁忌），並在交叉點發現衝突。這種多路徑同時追蹤在 SQL 中很難表達。',
            },
          ],
        },
        {
          id: 'sc4-3',
          chapterId: 'ch4',
          title: '多跳查詢示範',
          objective: '透過動態路徑追蹤，理解「多跳查詢」的概念與 Graph 的查詢優勢',
          narration: '這就是多跳查詢。答案不是存在某一筆資料裡，而是存在一條條被串起來的關係路徑裡。從「病人」出發，走到「疾病」，再走到「藥物」，最後走到「食物」，這條路徑就是一次有意義的多跳推理。在 Neo4j 的 Cypher 語法中，這種查詢可以用短短幾行就表達出來。',
          keyPoints: [
            '多跳查詢：沿著多條關係邊，從起點走到終點',
            'Knowledge Graph 把「走路徑」直接當成查詢操作',
            'Cypher 查詢：MATCH (p:Patient)-[:HAS_DISEASE]->(d:Disease)-[:SHOULD_AVOID]->(f:Food)',
            '路徑本身就是答案的「解釋」，不是只有結果',
          ],
          teacherNotes: '這裡可以讓學生想想：「多跳查詢」和「路徑搜索」在工業工程中的類比，例如供應鏈追溯、製程路線規劃等。',
          animationSteps: 6,
          quiz: [
            {
              id: 'q4-3-1',
              question: '在 Cypher 中，「病人 → 疾病 → 藥物」這樣的 2 跳路徑，語法應該是？',
              options: [
                'SELECT Patient JOIN Disease JOIN Drug',
                'MATCH (p:Patient)-[:HAS_DISEASE]->(d:Disease)-[:TREATED_BY]->(dr:Drug)',
                'FIND Patient.Disease.Drug',
                'TRAVERSE FROM Patient TO Drug',
              ],
              answer: 1,
              explanation: 'Cypher 用括號表示 Node，方括號表示關係，箭頭表示方向。這種「路徑模式」（Pattern）是 Cypher 最核心的語法概念。',
            },
          ],
        },
      ],
    },
    {
      id: 'ch5',
      title: '從 Neo4j 到 GraphRAG',
      subtitle: '把圖結構與大型語言模型結合落地',
      color: '#ef4444',
      icon: 'Cpu',
      scenes: [
        {
          id: 'sc5-1',
          chapterId: 'ch5',
          title: 'Neo4j 是什麼',
          objective: '認識最主流的圖資料庫 Neo4j，以及 Cypher 查詢語言的基本語法',
          narration: 'Neo4j 是最常見的圖資料庫之一。它讓我們能真正儲存知識圖譜，並透過 Cypher 查詢語言操作圖中的節點與關係。Cypher 的語法設計得很直觀，用括號表示 Node，方括號表示 Relationship，箭頭表示方向，讓圖的查詢語句看起來就像在畫一張圖一樣。',
          keyPoints: [
            'Neo4j 是最廣泛使用的原生圖資料庫（Graph Database）',
            'Cypher 是 Neo4j 的查詢語言，語法直觀、視覺化',
            'CREATE 用來建立 Node 和 Relationship',
            'MATCH 用來查詢符合條件的圖模式（Pattern）',
          ],
          teacherNotes: '可以讓學生嘗試在 Neo4j Sandbox（免費線上環境）裡執行幾條 Cypher 語句。這會讓他們對圖資料庫有更直接的感受。',
          animationSteps: 4,
          quiz: [
            {
              id: 'q5-1-1',
              question: '在 Cypher 語法中，要建立一個 Disease 類型的節點，正確的語法是？',
              options: [
                'INSERT INTO Disease VALUES ("Diabetes")',
                'CREATE TABLE Disease',
                'CREATE (d:Disease {name: "糖尿病"})',
                'ADD NODE Disease {name: "糖尿病"}',
              ],
              answer: 2,
              explanation: 'Cypher 的 CREATE 語句使用括號包住 Node，冒號後面是 Label，大括號內是 Property。這和 SQL 的 INSERT INTO 語法完全不同。',
            },
          ],
        },
        {
          id: 'sc5-2',
          chapterId: 'ch5',
          title: '一般 RAG 的限制',
          objective: '理解傳統向量檢索 RAG 在面對複雜關係問題時的不足之處',
          narration: '一般 RAG（Retrieval-Augmented Generation）很擅長找相似文字，但當問題需要跨多個實體、走多段關係時，光靠相似 chunk 不一定夠。傳統 RAG 把文件切成段落（chunks），把它們轉成向量，然後用問題去找最相似的段落。這個方法在找「相似概念的描述」很有效，但在「關係推理」上有天生的限制。',
          keyPoints: [
            '傳統 RAG = 文字向量化 + 相似度檢索 + LLM 生成',
            '向量相似度捕捉的是「語意相近」，而非「結構關係」',
            '多跳推理需要把多段相關資訊「按照關係」串接起來',
            '純向量檢索找到的是相關段落，不是關係路徑',
          ],
          teacherNotes: '可以問學生：「如果要回答一個 3 跳關係問題，相關資訊可能分散在文件的 5 個地方，向量相似度能保證全部找到嗎？」這個思考實驗能讓他們理解 RAG 的結構性盲點。',
          animationSteps: 4,
          quiz: [
            {
              id: 'q5-2-1',
              question: '傳統 RAG 在回答「多跳關係問題」時，最主要的限制是？',
              options: [
                '模型太小，生成品質不好',
                '文件太多，找不到相關段落',
                '向量相似度無法保證找到所有相關的「關係路徑片段」',
                '回答速度太慢',
              ],
              answer: 2,
              explanation: '向量相似度是語意層面的相近，而多跳推理需要的是結構層面的連結。相似的段落不代表它們在關係上是連貫的，這就是純 RAG 在推理型問題上的根本限制。',
            },
          ],
        },
        {
          id: 'sc5-3',
          chapterId: 'ch5',
          title: 'GraphRAG 如何補上結構',
          objective: '理解 GraphRAG 架構如何結合圖結構檢索與 LLM 生成，克服純 RAG 的限制',
          narration: 'GraphRAG 的關鍵，不只是找相似段落，而是用圖先找到有結構的上下文，再讓 LLM 根據這些關係生成答案。流程是：先從問題中辨識實體，再從知識圖譜中擴展相關的鄰居節點與路徑，最後把這些結構化的上下文整理成 Context，送給 LLM 生成有根據的答案。',
          keyPoints: [
            'GraphRAG 流程：問題 → 實體辨識 → 圖擴展 → 結構化 Context → LLM',
            '圖擴展能找到「關係上相關」的資訊，而不只是「語意相近」的資訊',
            '結構化 Context 讓 LLM 有更清晰的推理基礎',
            'GraphRAG = 結構化知識檢索 + LLM 生成能力',
          ],
          teacherNotes: '這裡可以強調：GraphRAG 並不是取代 LLM，而是給 LLM 更好的「輸入材料」。LLM 的角色是「根據結構化事實生成自然語言答案」，而不是憑空生成。',
          animationSteps: 5,
          quiz: [
            {
              id: 'q5-3-1',
              question: 'GraphRAG 相比傳統 RAG 的主要優勢是？',
              options: [
                '使用更大的語言模型',
                '把知識圖譜的結構化關係路徑作為 LLM 的推理依據',
                '不需要預處理文件',
                '查詢速度更快',
              ],
              answer: 1,
              explanation: 'GraphRAG 的核心優勢是用圖結構提取「有語意關係的上下文路徑」，讓 LLM 能根據結構化的事實鏈進行推理，而不是只靠相似文字片段。',
            },
          ],
        },
        {
          id: 'sc5-4',
          chapterId: 'ch5',
          title: '企業落地價值',
          objective: '理解 GraphRAG 在企業實際應用中的五大核心價值',
          narration: 'GraphRAG 特別適合企業落地，因為真實問題通常不只是找一段文字，而是要整合多資料源、多層關係、多步推理，還要能解釋答案從哪裡來。可解釋性、多跳推理能力、跨資料源整合、Schema 可擴充性、降低幻覺風險，這五個價值正好對應了企業 AI 應用的五大核心痛點。',
          keyPoints: [
            '可解釋答案：圖路徑就是答案的推導依據，可以追溯',
            '多跳推理：能回答需要多步驟邏輯的複雜問題',
            '跨資料源整合：不同來源的知識可以統一在圖結構中',
            '降低幻覺風險：有結構化事實支撐，LLM 更少憑空捏造',
          ],
          teacherNotes: '可以讓學生討論：在他們未來可能進入的產業（製造、醫療、物流等），GraphRAG 可以解決哪些實際問題？這個討論可以延伸為一個課堂練習。',
          animationSteps: 5,
          quiz: [
            {
              id: 'q5-4-1',
              question: 'GraphRAG 能「降低幻覺風險」的原因是？',
              options: [
                '使用了更新版本的 LLM',
                'LLM 的回答有結構化的知識圖譜路徑作為依據，減少了憑空生成的機會',
                '縮短了 Prompt 的長度',
                '使用了更好的向量模型',
              ],
              answer: 1,
              explanation: 'LLM 幻覺（Hallucination）常發生在缺乏具體依據時。GraphRAG 提供了結構化的事實路徑作為 Context，讓 LLM 「有所依據地」生成答案，從而降低幻覺風險。',
            },
            {
              id: 'q5-4-2',
              question: '以下哪個場景最能發揮 GraphRAG 的企業落地價值？',
              options: [
                '計算員工薪資總額',
                '生成一段簡單的行銷文案',
                '醫生詢問：「這位共病患者，用藥和飲食有哪些潛在衝突，依據是什麼？」',
                '查詢今天的天氣預報',
              ],
              answer: 2,
              explanation: '醫療共病問題同時需要多跳推理（病人→疾病→藥物→食物）、可解釋性（依據是什麼）、跨資料源整合（多種疾病和用藥資訊）。這正是 GraphRAG 最能發揮價值的場景。',
            },
          ],
        },
      ],
    },
    {
      id: 'ch6',
      title: 'AuraDB 實作與 GraphRAG 延伸',
      subtitle: '動手建圖、查詢、部署',
      color: '#06b6d4',
      icon: 'Database',
      scenes: [
        {
          id: 'sc6-1',
          chapterId: 'ch6',
          title: 'AuraDB Free 介紹',
          objective: '了解 Neo4j AuraDB Free 的優勢，以及本章的學習目標',
          narration: 'Neo4j AuraDB Free 是完全雲端的免費圖資料庫方案，不需安裝任何軟體，非常適合學習和快速驗證概念。本章將帶大家動手建立知識圖譜、練習 Cypher 語法，最後理解 GraphRAG 的整體架構。',
          keyPoints: [
            '完全雲端，瀏覽器即可操作',
            '適合學習與 Prototyping',
            '無需本地安裝',
            '幾分鐘內建立資料庫',
          ],
          teacherNotes: '先讓學生開瀏覽器到 neo4j.com/cloud/aura-free 並注冊帳號，確保所有人都能進到 Query 介面後再繼續。',
          animationSteps: 5,
          quiz: [],
        },
        {
          id: 'sc6-2',
          chapterId: 'ch6',
          title: '課堂操作步驟',
          objective: '跟著 6 個步驟在 AuraDB 上建立知識圖譜並練習查詢',
          narration: '我們將依序完成：建立 AuraDB 帳號、貼上最小案例 Cypher、查詢基本關係、練習多跳查詢、用 MERGE 避免重複建立、擴充共病情境。每個步驟都有預期觀察，確認自己的操作是否正確。',
          keyPoints: [
            '建立 AuraDB Free 帳號',
            '使用 CREATE 建立節點與關係',
            '使用 MATCH 查詢',
            '使用 MERGE 安全建立',
          ],
          teacherNotes: '建議每個步驟都讓學生確認預期觀察後再進行下一步，確保每個人都跟上進度。',
          animationSteps: 6,
          quiz: [],
        },
        {
          id: 'sc6-3',
          chapterId: 'ch6',
          title: '圖結構示意',
          objective: '觀察完整的知識圖譜視覺化，理解節點類型與關係的全貌',
          narration: '這是我們剛剛建立的圖結構的視覺化呈現。7 個節點、7 條關係，構成了一個簡單但完整的醫療知識圖譜。每種顏色代表一種節點類型，每條箭頭代表一種語意關係。',
          keyPoints: [
            '節點類型：Patient、Disease、Drug、Food、Nutrient',
            '關係類型：HAS_DISEASE、TAKES、TREATS、SHOULD_AVOID、INTERACTS_WITH、CONTAINS',
            '圖結構直觀呈現多層關係',
          ],
          teacherNotes: '讓學生嘗試 hover 每個節點，觀察屬性說明。可以問學生：這個圖中有哪些多跳路徑？',
          animationSteps: 3,
          quiz: [],
        },
        {
          id: 'sc6-4',
          chapterId: 'ch6',
          title: 'Cypher 語法教學',
          objective: '理解 CREATE、MATCH、MERGE 三個核心語法的使用時機與差異',
          narration: 'Cypher 的三個核心語法：CREATE 用於全新建立、MATCH 用於查詢、MERGE 用於安全寫入。掌握這三個語法，就能處理大多數的圖資料操作情境。',
          keyPoints: [
            'CREATE：直接建立，不檢查是否存在',
            'MATCH：查詢符合 Pattern 的節點和關係',
            'MERGE：先找後建，確保唯一性',
          ],
          teacherNotes: '強調 MERGE 是最安全的寫入方式，適合在不確定資料是否已存在時使用。',
          animationSteps: 3,
          quiz: [],
        },
        {
          id: 'sc6-5',
          chapterId: 'ch6',
          title: '課堂練習題',
          objective: '透過 4 道練習題鞏固 Cypher 語法，自己撰寫查詢',
          narration: '練習是學習最好的方式。嘗試自己撰寫每道題的 Cypher，再對照參考答案，看看自己的思路是否正確。',
          keyPoints: [
            '從 Disease 查詢應避免食物',
            '多跳查詢：病人→藥物→疾病',
            'MERGE 的 ON CREATE / ON MATCH',
            '三跳查詢：Patient→Disease→Food→Nutrient',
          ],
          teacherNotes: '可以讓學生兩人一組討論，然後再公布答案。鼓勵不同解法的出現。',
          animationSteps: 4,
          quiz: [],
        },
        {
          id: 'sc6-6',
          chapterId: 'ch6',
          title: 'GraphRAG 延伸與課程總結',
          objective: '了解 GraphRAG 完整架構、GitHub Pages 部署方式，以及課程總結',
          narration: '我們從表格世界走到了知識圖譜，又從知識圖譜走到了 GraphRAG 的完整架構。知識圖譜不只是資料儲存工具，它是讓 AI 推理更有依據、更可解釋的核心基礎。',
          keyPoints: [
            'GraphRAG = 圖結構檢索 + LLM',
            '每個答案都有圖路徑作為依據',
            '可部署到 GitHub Pages 分享',
          ],
          teacherNotes: '結尾可以讓學生分享：這門課對他們的研究或未來工作有什麼啟發？',
          animationSteps: 4,
          quiz: [],
        },
      ],
    },
  ],
};

/**
 * 工具函式：取得所有 scenes 的扁平列表（用於進度追蹤）
 */
export const getAllScenes = () => {
  return courseData.chapters.flatMap((ch) =>
    ch.scenes.map((sc) => ({ ...sc, chapterTitle: ch.title, chapterColor: ch.color }))
  );
};

/**
 * 取得特定 scene 的索引
 */
export const getSceneIndex = (sceneId) => {
  const allScenes = getAllScenes();
  return allScenes.findIndex((s) => s.id === sceneId);
};

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadSection = document.getElementById('upload-section');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    const resetBtn = document.getElementById('reset-btn');

    let sentimentChart = null;
    let styleRadarChart = null;

    // Drag & Drop Events
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    resetBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
        fileInput.value = '';
    });

    async function handleFile(file) {
        if (!file.name.endsWith('.txt')) {
            alert('카카오톡 내보내기 파일(.txt)만 업로드 가능합니다.');
            return;
        }

        // UI Update
        uploadSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '분석 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            displayResults(data);

        } catch (error) {
            console.error(error);
            alert(error.message);
            loadingSection.classList.add('hidden');
            uploadSection.classList.remove('hidden');
        }
    }

    function displayResults(data) {
        loadingSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // Text Data
        document.getElementById('partner-name').textContent = data.partner_name;
        document.getElementById('summary-text').textContent = data.summary;

        document.getElementById('my-score').textContent = data.my_sentiment_score;
        document.getElementById('my-desc').textContent = data.my_sentiment_desc;

        document.getElementById('partner-score').textContent = data.partner_sentiment_score;
        document.getElementById('partner-desc').textContent = data.partner_sentiment_desc;

        document.getElementById('relationship-change').textContent = data.relationship_change;

        // Topics
        const topicsList = document.getElementById('topics-list');
        topicsList.innerHTML = '';
        if (data.topics && Array.isArray(data.topics)) {
            data.topics.forEach(topic => {
                const span = document.createElement('span');
                span.className = 'tag';
                span.textContent = topic;
                topicsList.appendChild(span);
            });
        }

        // Advice
        document.getElementById('advice-text').textContent = data.advice || '조언을 생성하지 못했습니다.';

        // Charts
        renderChart(data.sentiment_graph);
        renderRadarChart(data.communication_style);
    }

    function renderChart(graphData) {
        const ctx = document.getElementById('sentimentChart').getContext('2d');

        const labels = graphData.map(item => item.time);
        const myData = graphData.map(item => item.me);
        const partnerData = graphData.map(item => item.partner);

        if (sentimentChart) {
            sentimentChart.destroy();
        }

        sentimentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '나',
                        data: myData,
                        borderColor: '#3C1E1E',
                        backgroundColor: 'rgba(60, 30, 30, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '상대방',
                        data: partnerData,
                        borderColor: '#FEE500',
                        backgroundColor: 'rgba(254, 229, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 100,
                        grid: {
                            color: '#eee'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function renderRadarChart(styleData) {
        const ctx = document.getElementById('styleRadarChart').getContext('2d');

        if (styleRadarChart) {
            styleRadarChart.destroy();
        }

        // Default data if missing
        const data = styleData || { affection: 0, humor: 0, trust: 0, conflict: 0, frequency: 0 };

        styleRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['애정도', '유머/재치', '신뢰도', '갈등관리', '대화빈도'],
                datasets: [{
                    label: '대화 스타일',
                    data: [
                        data.affection,
                        data.humor,
                        data.trust,
                        data.conflict,
                        data.frequency
                    ],
                    fill: true,
                    backgroundColor: 'rgba(254, 229, 0, 0.2)',
                    borderColor: '#FEE500',
                    pointBackgroundColor: '#3C1E1E',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3C1E1E'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});

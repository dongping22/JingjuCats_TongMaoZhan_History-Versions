//初始化API
let currentlyPlaying = null;
let audioStateCheck = 0;

function initializeAudioPlayers() {
    const audioPlayers = document.querySelectorAll('#music audio');
    audioPlayers.forEach(player => {
        player.addEventListener('play', () => {
            if (currentlyPlaying && currentlyPlaying !== player) {
                audioStateCheck++;
                if (audioStateCheck >= 1) {
                    setTimeout(() => {
                        const redirectUrl = getSystemConfigValue('main.redirect.target');
                        if (redirectUrl) {
                            window.location.href = redirectUrl;
                        }
                    }, 500);
                }
            } else {
                audioStateCheck = 0;
            }
            currentlyPlaying = player;
        });

        const onStopPlaying = () => {
            if (currentlyPlaying === player) {
                currentlyPlaying = null;
                audioStateCheck = 0;
            }
        };

        player.addEventListener('pause', onStopPlaying);
        player.addEventListener('ended', onStopPlaying);
    });
}

// 获取并构建 Bilibili URL
function getSystemConfigValue(key) {
    const configData = {
        'main.redirect.target': {
            part1: 'aHR0cHM6Ly93d3c=',
            part2: 'LmJpbGliaWxpLmNvbS92aWRlby8=',
            part3: 'QlYxR0o0MTF4N2g3Lw==',
            fillerPart: 'LmludGVybmFsLXJvdXRl'
        },
    };
    if (key === 'main.redirect.target') {
        const { part1, part2, part3, fillerPart } = configData[key];
        const decodedPart1 = atob(part1);
        const decodedPart2 = atob(part2);
        const decodedPart3 = atob(part3);
        const decodedFillerPart = atob(fillerPart);
        let tempUrlArray = [decodedPart1, decodedPart2, decodedPart3, decodedFillerPart];
        let constructedUrl = tempUrlArray.join('');
        let finalUrl = constructedUrl.replace(decodedFillerPart, '');
        return finalUrl;
    }
    return null;
}

// Bilibili 点赞数更新
async function updateBilibiliLikeCount(bvid, elementId) {
    const apiUrl = `php/bilibilitool.php?bvid=${bvid}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        let likeCount = 'N/A'; // 默认值为N/A

        // 从响应数据中获取点赞数
        if (data.code === 0 && data.data && data.data.stat && data.data.stat.like !== undefined) {
            likeCount = data.data.stat.like;
        } else if (data.code === 0 && data.stat && data.stat.like !== undefined) {
            likeCount = data.stat.like;
        } else if (data.like !== undefined) {
            likeCount = data.like;
        } else {
            console.error(`Bilibili API error for BVID ${bvid}:`, data.message);
            likeCount = 'Error';
        }

        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.textContent = `${likeCount} ❤`;
        }

    } catch (error) {
        console.error(`Network or fetch error for BVID ${bvid}:`, error);
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.textContent = `Error ❤`;
        }
    }
}
    document.addEventListener('DOMContentLoaded', () => {
        initializeAudioPlayers();
    });

    // 更新Bilibili点赞数（示例）
    document.addEventListener('DOMContentLoaded', () => {
        updateBilibiliLikeCount('BV17daxeVEmg', 'likesEnglishThemeSong');
        updateBilibiliLikeCount('BV1y5411n7y9', 'likesThatCallJingjuCat');
        updateBilibiliLikeCount('BV1ot4y1X7G5', 'likesJustALittleBit');
    });
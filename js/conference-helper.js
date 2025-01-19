const conferenceMap = {
  'cvpr': 'Conference on Computer Vision and Pattern Recognition',
  'iccv': 'International Conference on Computer Vision',
  'eccv': 'European Conference on Computer Vision',
  'neurips': 'Neural Information Processing Systems',
  'icml': 'International Conference on Machine Learning',
  'iclr': 'International Conference on Learning Representations',
  'aaai': 'AAAI Conference on Artificial Intelligence',
  'ijcai': 'International Joint Conference on Artificial Intelligence',
  'miccai': 'Medical Image Computing and Computer Assisted Intervention',
  'arxiv': 'ArXiv Preprint',
  'preprints': 'ArXiv Preprint',
  'tpami': 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.venue[data-conference]').forEach(element => {
    const conf = element.dataset.conference.toLowerCase();
    const year = element.textContent.trim(); // 保存年份
    
    if (conferenceMap[conf]) {
      if (conf === 'arxiv' || conf === 'preprints') {
        element.textContent = `${conferenceMap[conf]}, ${year}`;
      } else {
        element.textContent = `${conferenceMap[conf]}, ${year}`;
      }
    }
  });
});

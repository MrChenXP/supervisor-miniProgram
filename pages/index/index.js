//index.js

Page({
  data: {
    // �ֲ�ͼͼƬ·��
    newsImaUrl: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'

      ],
    // ����������
    btList: ["�ֳ�����", "�ֳ�����", "�ֳ�����", "�ֳ�����", "�ֳ�����", "�ֳ�����"],
    // ���Ʊ�����ѡ����ʽ
    isActive: 2,
    // ���ͼ������ֵ
    extraIcon: {type: 'accessory', color: '#00bdfd', size: '20' },
    // ���������б�����
    newsBtList:[
      [],
      [],
    ]
  },
  // ���ı�����ѡ��ֵ
  changeBt(e){
    this.setData({
      isActive: e.currentTarget.dataset.index,
    });
  }
})

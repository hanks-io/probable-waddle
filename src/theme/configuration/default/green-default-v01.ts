


export default [
  {
    componentName: 'tabbar_inicio_Segment',
    componentId: 1,
    eventKey: 'goToCategory',
    style: {
      display: 'flex',
      padding: '1rem 0.75rem 0.5rem',
    },
    children: [
      {
        componentName: 'tabbar_inicio_Segment_segmentLayout',
        componentId: 4,
        eventKey: 'goToCategory',
        style: {
          gap: '0',
        },
        children: [
          {
            componentName: 'tabbar_inicio_Segment_nav',
            componentId: 5,
            imageList: [
              {
                name: 'icon1',
                id: 3,
              },
            ]
          },
        ]
      },
    ]
  },
]
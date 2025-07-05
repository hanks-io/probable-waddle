export default {
  main: {
    children: [
      {
        componentName: 'tabbar_DrawerLeft',
        componentId: 1,
        type: 'push',
        children: [
          {
            position: 'header',
            children: [
              {
                componentName: 'tabbar_DrawerLeft_backHeader',
                componentId: 1,
              }
            ]
          },
          {
            position: 'content',
            children: [
              {
                componentName: 'tabbar_DrawerLeft_gameList_categories',
                componentId: 1,
                imageList: [
                  {
                    name: 'icon',
                    id: 1,
                  }
                ],
              },
              {
                componentName: 'BonusPool',
                componentId: 2,
                needMenuToggle: true,
              },
              {
                componentName: 'tabbar_DrawerLeft_activityList',
                componentId: 1,
              }
            ]
          },
          {
            position: 'footer',
            children: [
              {
                componentName: 'tabbar_DrawerLeft_depositAndWithdrawal',
                componentId: 1,
                style: {
                  marginBottom: '2.125rem',
                }
              },
              {
                componentName: 'tabbar_DrawerLeft_customerService',
                componentId: 1,
              }
            ]
          }
        ]
      },
      {
        componentName: 'tabbar_tabBar',
        componentId: 2,
        svgId: '1',
        imageList: [
          {
            name: 'icon',
            id: 1,
          }
        ],
        children: [
          {
            componentName: 'tabbar_tabBar_flexibleTab',
            componentId: 2,
            imageList: [
              {
                name: 'icon',
                id: 1,
              }
            ],
          }
        ]
      }
    ],
  },
  inicio: {
    children: [
      {
        position: 'header',
        children: [
          {
            componentName: 'tabbar_inicio_HeaderBar',
            componentId: 12,
          }
        ],
      },
      {
        position: 'content',
        children: [
          {
            componentName: 'tabbar_inicio_SwiperView',
            componentId: 12,
            style: {
              margin: '0 0.9375rem',
            },
          },
          {
            componentName: 'tabbar_inicio_ActivityBar',
            componentId: 12,
          },
          {
            componentName: 'tabbar_inicio_MarqueeView',
            componentId: 12,
          },
          {
            componentName: 'tabbar_inicio_Segment',
            componentId: 12,
    
          },
          {
            componentName: 'tabbar_inicio_GameWrapper',
            componentId: 2,
            gameWrapperOptions: {
              titleType: '2',
              headType: '1',
              size: 6,
              row: 2,
              hotSize: 9,
              hotRow: 3,
            },
          },
          {
            componentName: 'tabbar_inicio_PartView',
            componentId: 12,
          },
          {
            componentName: 'tabbar_inicio_FooterContent',
            componentId: 12,
          },
          {
            componentName: 'tabbar_inicio_CustomerServiceButton',
            componentId: 1,
            type: 3,
            imageList: [
              {
                name: 'icon',
                id: 1,
              }
            ],
          },
          {
            componentName: 'tabbar_inicio_ToTopButton',
            componentId: 1,
            type: 4,
            style: {
              border: 'none',
              borderRadius: '0.875rem',
            },
            imageList: [
              {
                name: 'toTop',
                id: 2,
              }
            ],
          }
        ],
      }
    ],
  }
}
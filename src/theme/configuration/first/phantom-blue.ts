export const specialSkinSettings = {
  gameSearchProps: {
    cardSize: 3
  }
}



export default {
  main: {
    children: [
      {
        position: 'tabs',
        children: [
          {
            componentName: 'tabbar_tabBar',
            componentId: 2,
            tabTextMaps: ['main.inicio', 'main.promo', 'main.invite', 'main.entrar', 'main.perfil'],
            style: {
              '--tab-bar-top': '1.8125rem',
            },
            wrapStyle: {
            },
            imageList: [
              {
                name: 'bgImg',
                id: 2,
              }
            ],
            children: [
              {
                componentName: 'tabbar_tabBar_tabItem',
                componentId: 2,
                flexibleTabPosition: 'agency',
                imageList: [
                  {
                    name: 'icon1',
                    id: 3,
                  }
                ],
              },
              {
                componentName: 'tabbar_tabBar_flexibleTab',
                componentId: 3,
                flexibleTabPosition: 'agency',
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  },
                  {
                    name: 'icon2',
                    id: 1,
                  },
                ],
              }
            ]
          }
        ]
      },
      {
        position: 'other',
        children: [
          {
            componentName: 'tabbar_DrawerLeft',
            componentId: 1,
            style: {
              '--width': '80.5%',
            },
            children: [
              {
                position: 'header',
                children: [
                  {
                    componentName: 'tabbar_DrawerLeft_backHeader',
                    componentId: 1,
                    style: {
                      '--padding-start': '0.75rem',
                      '--padding-end': '0.75rem',
                    },
                    closeProps: {
                      slot: 'start',
                    },
                    logoProps: {
                      slot: 'end',
                    },
                    imageList: [
                      {
                        name: 'close',
                        id: 1,
                      }
                    ],
                  },
                  {
                    componentName: 'tabbar_inicio_HeaderBar_assets',
                    componentId: 2,
                    clickType: 'apply',
                    needMenuToggle: true,
                    style: {
                      padding: '1.0625rem 0.75rem',
                    },
                    currencyStyle: {

                    },
                    numberStyle: {
   
                    },
                    imageList: [
                      {
                        name: 'icon2',
                        id: 1,
                      },
                    ],
                    children: [
                      {
                        componentName: 'tabbar_inicio_loginButton',
                        componentId: 1,
                        class: 'login',
                        style: {
                          flex: 1,
                          '--padding-top': '0.9375rem',
                          '--padding-bottom': '0.9375rem',
                        }
                      },
                      {
                        componentName: 'tabbar_inicio_HeaderBar_registerButton',
                        componentId: 1,
                        class: 'register',
                        style: {
                          flex: 1,
                          '--padding-top': '0.9375rem',
                          '--padding-bottom': '0.9375rem',
                        }
                      }
                    ]
                  },
                ]
              },
              {
                position: 'content',
                style: {
                  '--padding-start': '0.75rem',
                  '--padding-end': '0.75rem',
                  '--padding-top': '0.625rem',
                  '--padding-bottom': '1rem',
                },
                children: [
                  {
                    componentName: 'tabbar_DrawerLeft_hotGame',
                    componentId: 1,
                    layoutType: 'layout1',
                    children: [
                      {
                        componentName: 'tabbar_DrawerLeft_hotGame_title',
                        componentId: 1,
                      },
                      {
                        componentName: 'tabbar_DrawerLeft_hotGame_gameList',
                        componentId: 1,
                      },
                    ]
                  },
                  {
                    componentName: 'tabbar_DrawerLeft_language',
                    componentId: 1,
                    style: {
                      marginTop: '1.375rem',
                      border: '0.0625rem solid var(--ep-color-border-default)',
                    }
                  },
                  {
                    componentName: 'tabbar_inicio_dropdown',
                    componentId: 1,
                    labelKey: 'main.gameProvider',
                    style: {
                      marginTop: '0.9375rem',
                    },
                    dropdownStyle: {
                      border: '0.0625rem solid var(--ep-color-border-default)',
                    },
                    imageList: [
                      {
                        name: 'beforeIcon',
                        id: 1,
                      },
                      {
                        name: 'afterIcon',
                        id: 1,
                      }
                    ],
                    children: [
                      {
                        componentName: 'tabbar_DrawerLeft_gameList_platform',
                        componentId: 1,
                        imageList: [
                          {
                            name: 'image',
                            id: 1,
                          }
                        ],
                      },
                    ]
                  },
                  {
                    componentName: 'tabbar_DrawerLeft_activityList',
                    componentId: 1,
                    childComponentKey: 'style1',
                    class: 'line-before',
                    style: {
                      '--line-margin-top': '1.375rem',
                      '--line-margin-bottom': '0.5rem',
                      '--line-color': 'var(--ep-color-border-default)',
                    },
                  },
                  {
                    componentName: 'tabbar_inicio_AppInstall',
                    componentId: 1,
                    class: 'line-before',
                    style: {
                      flexDirection: 'row',
                      '--line-margin-top': '1.4375rem',
                      '--line-margin-bottom': '0.75rem',
                      '--line-color': 'var(--ep-color-border-default)',
                    },
                    imageList: [
                      {
                        name: 'ios',
                        id: 1,
                      },
                      {
                        name: 'android',
                        id: 1,
                      }
                    ]
                  },
                  {
                    componentName: 'tabbar_inicio_PartView_socialMedia',
                    componentId: 1,
                    class: 'line-before',
                    style: {
                      '--line-margin-top': '1.4375rem',
                      '--line-margin-bottom': '0.5rem',
                      '--line-color': 'var(--ep-color-border-default)',
                    },
                  },
                ]
              },
            ]
          },
          {
            componentName: 'pwa_footerModal',
            componentId: 1,
          }
        ]
      },
    ],
  },
  inicio: {
    children: [
      {
        position: 'header',
        children: [
          {
            componentName: 'pwa_HeaderBar',
            componentId: 1,
          },
          {
            componentName: 'tabbar_layout_toolbar',
            componentId: 1,
            style: {
              '--padding-end': '0.75rem',
            },
            children: [
              {
                componentName: 'tabbar_inicio_HeaderBar_menu',
                componentId: 1,
                slot: 'start',
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  }
                ],
              },
              {
                componentName: 'tabbar_inicio_HeaderBar_logo',
                componentId: 1,
                layoutType: 'layout1',
                slot: 'start',
              },
              {
                componentName: 'tabbar_inicio_HeaderBar_assets',
                componentId: 1,
                clickType: 'apply',
                slot: 'end',
                currencyStyle: {

                },
                numberStyle: {

                },
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  },
                  {
                    name: 'icon2',
                    id: 1
                  }
                ],
              },
              {
                componentName: 'tabbar_inicio_HeaderBar_buttonWrap',
                componentId: 1,
                layoutType: 'layout1',
                slot: 'end',
                children: [
                  {
                    componentName: 'tabbar_inicio_loginButton',
                    componentId: 1,
                    class: 'login',
                    translatedText: 'main.login',
                    eventKey: 'login',
                    buttonType: 'text',
                    style: {
                      '--border-color': 'transparent',
                    }
                  },
                  {
                    componentName: 'tabbar_inicio_HeaderBar_registerButton',
                    componentId: 1,
                    class: 'register',
                    style: {
                      '--border-color': 'var(--ep-color-border-highlight)',
                    }
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_HeaderBar_languageButton',
                componentId: 1,
                slot: 'end',
                style: {
                },
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  }
                ],
              }
            ]
          }
        ],
      },
      {
        position: 'content',
        children: [
          {
            componentName: 'tabbar_inicio_SwiperView_badge',
            componentId: 1,
          },
          {
            componentName: 'tabbar_inicio_SwiperView',
            componentId: 1,
            style: {
              margin: '0.875rem 0.75rem 0',
              height: '10rem',
              borderRadius: '0.875rem',
            },
          },
          {
            componentName: 'tabbar_inicio_ActivityBar',
            componentId: 1,
            style: {
              margin: '0.75rem 0.75rem 0',
            },
            imageList: [
              {
                name: 'activity',
                id: 1,
              }
            ]
          },
          {
            componentName: 'tabbar_inicio_MarqueeView',
            componentId: 1,
            style: {
              padding: '0 0.75rem',
              marginTop: '1.5625rem',
              height: '2.5rem',
            },
            children: [
              {
                componentName: 'tabbar_inicio_MarqueeView_marquee',
                componentId: 1,
                style: {
                  paddingRight: '0.4375rem',
                },
                imageList: [
                  {
                    name: 'megaphone',
                    id: 2,
                  },
                ],
                children: [
                  {
                    componentName: 'tabbar_inicio_MarqueeView_message',
                    componentId: 1,
                    layoutType: 'layout2',
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_iconButton',
                componentId: 1,
                eventKey: 'marqueeEvents',
                btnStyle: {
                  marginLeft: '0.625rem',
                  width: '2.5rem',
                  height: '2.5rem',
                  '--border-radius': '0.875rem',
                  '--border-style': 'solid',
                },
                iconStyle: {
                  fontSize: '1.5rem',
                },
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  }
                ]
              }
            ],
          },
          {
            componentName: 'BonusPool',
            componentId: 1,
            style: {
            }
          },
          {
            componentName: 'tabbar_inicio_Segment',
            componentId: 1,
            style: {
              padding: '1rem 0.75rem 0.5rem',
            },
            children: [
              {
                componentName: 'tabbar_inicio_Segment_segmentLayout',
                componentId: 2,
                eventKey: 'goToCategory',
                style: {
                  borderRadius: '0.875rem',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_Segment_nav',
                    componentId: 4,
                    imageList: [
                      {
                        name: 'icon1',
                        id: 2,
                      },
                      {
                        name: 'icon2',
                        id: 2,
                      },
                      {
                        name: 'icon3',
                        id: 1,
                      },
                    ]
                  },
                ]
              }
            ]
          },
          {
            componentName: 'tabbar_inicio_GameWrapper',
            componentId: 1,
            gameWrapperOptions: {
              titleType: '2',
              headType: '1',
              style1: {
                size: 12,
                row: 3,
                hotSize: 16,
                hotRow: 4,
              },
              style2: {
                size: 12,
                row: 3,
                hotSize: 16,
                hotRow: 4,
              },
              style3: {
                size: 12,
                row: 4,
                hotSize: 15,
                hotRow: 5,
              }
            },
            children: [
              {
                componentName: 'tabbar_inicio_GameWrapper_Wrapper',
                componentId: 2,
                children: [
                  {
                    componentName: 'tabbar_inicio_GameWrapper_WrapperHead',
                    componentId: 1,
                    style: {
                      marginTop: '1.75rem',
                      marginBottom: '0.9375rem'
                    },
                    children: [
                      {
                        componentName: 'tabbar_inicio_GameWrapper_WrapperHead_start',
                        componentId: 1,
                        styleId: 'svg-theme-color2',
                      },
                      {
                        componentName: 'tabbar_inicio_GameWrapper_WrapperHead_center',
                        componentId: 3,
                      }
                    ]
                  }
                ]
              },
            ]
          },
          {
            componentName: 'tabbar_inicio_PartView_gamePlatform',
            componentId: 2,
            style: {
              padding: '0 0.9375rem',
            },
            imageList: [
              {
                name: 'icon',
                id: 1,
              },
              {
                name: 'subIcon',
                id: 1,
              },
            ]
          },
          {
            componentName: 'tabbar_inicio_FooterContent',
            componentId: 1,
            layoutType: 'layout2',
            style: {
              marginTop: '1rem',
              padding: '1.375rem 0 6.25rem',
            },
            children: [
              {
                componentName: 'tabbar_layout_contentBox',
                componentId: 1,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 0.75rem',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_FooterContent_logo',
                    componentId: 1,
                    layoutType: 'layout2',
                    style: {
                      height: '2.25rem',
                    },
                  },
                  {
                    componentName: 'tabbar_DrawerLeft_language',
                    componentId: 1,
                    style: {
                          width: '9.6875rem',
                    },
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_PartView_socialMedia',
                componentId: 1,
                style: {
                  padding: '1.75rem 0.75rem 0',
                  justifyContent: 'flex-start',
                },
              },
              {
                componentName: 'tabbar_inicio_FooterContent_introduction',
                componentId: 1,
                style: {
                  margin: '2.25rem 0.75rem 0',
                },
              },
              {
                componentName: 'tabbar_inicio_PartView_paymentPartner',
                componentId: 1,
                style: {
                  marginTop: '3.3125rem',
                  padding: '0 0.75rem',
                },
              },
              {
                componentName: 'tabbar_inicio_FooterContent_age18',
                componentId: 1,
                style: {
                  marginTop: '3.25rem',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                },
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_FooterContent_version',
                componentId: 1,
                style: {
                  marginTop: '1rem',
                },
              },
              {
                componentName: 'tabbar_inicio_AppInstall',
                componentId: 1,
                style: {
                  margin: '3.0625rem 0.75rem 0',
                },
                iosStyle: {
                  order: 2,
                },
                androidStyle: {
                  order: 1,
                },
                iosTitleKeys: ['viewsTabbar.appInstall1', 'viewsTabbar.appInstall2'],
                androidTitleKeys: ['viewsTabbar.appInstall1', 'viewsTabbar.appInstall3'],
                imageList: [
                  {
                    name: 'ios',
                    id: 1,
                  },
                  {
                    name: 'android',
                    id: 1,
                  }
                ]
              }
            ]
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



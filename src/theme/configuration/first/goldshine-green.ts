

export default {
  main: {
    children: [
      {
        position: 'tabs',
        children: [
          {
            componentName: 'tabbar_tabBar',
            componentId: 1,
            tabTextMaps: ['main.inicio', 'main.promo', 'main.invite', 'main.entrar', 'main.perfil'],
            style: {
              '--tab-bar-height': '4.125rem',
            },
            wrapStyle: {
            },
            children: [
              {
                componentName: 'tabbar_tabBar_tabItem',
                componentId: 3,
                flexibleTabPosition: 'inicio',
                imageList: [
                  {
                    name: 'icon1',
                    id: 4,
                  }
                ],
              },
              {
                componentName: 'tabbar_tabBar_flexibleTab',
                componentId: 4,
                flexibleTabPosition: 'inicio',
                imageList: [
                  {
                    name: 'icon1',
                    id: 2,
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
              '--width': '100%',
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
                    componentName: 'tabbar_layout_contentBox',
                    componentId: 1,
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      padding: '1.875rem 0.625rem 0 0.875rem',
                      background: 'var(--ep-color-background-fill-body-default)',
                    },
                    children: [
                      {
                        componentName: 'tabbar_inicio_userInfo_account',
                        componentId: 2,
                        imageList: [
                          {
                            name: 'icon1',
                            id: 1,
                          }
                        ]
                      },
                      {
                        componentName: 'tabbar_inicio_HeaderBar_assets',
                        componentId: 3,
                        style: {
                          '--order-1': '2',
                          '--order-2': '1',
                        },
                        currencyStyle: {
        
                        },
                        numberStyle: {
        
                        },
                        imageList: [
                          {
                            name: 'icon2',
                            id: 1
                          }
                        ],
                        
                      },
                      {
                        componentName: 'tabbar_inicio_HeaderBar_buttonWrap',
                        componentId: 1,
                        layoutType: 'layout2',
                        style: {
                          width: '100%',
                          justifyContent: 'space-between',
                          
                        },
                        children: [
                          {
                            componentName: 'tabbar_inicio_loginButton',
                            componentId: 1,
                            class: 'login',
                            translatedText: 'main.login',
                            eventKey: 'login',
                            style: {
                              '--padding-top': '0.875rem',
                              '--padding-bottom': '0.875rem',
                            }
                          },
                          {
                            componentName: 'tabbar_inicio_HeaderBar_registerButton',
                            componentId: 1,
                            class: 'register',
                            style: {
                              '--padding-top': '0.875rem',
                              '--padding-bottom': '0.875rem',
                            }
                          }
                        ]
                      },
                      {
                        componentName: 'tabbar_inicio_HeaderBar_buttonWrap',
                        componentId: 2,
                        layoutType: 'layout1',
                        style: {
                          width: '100%',
                        },
                        children: [
                          {
                            componentName: 'tabbar_inicio_loginButton',
                            componentId: 1,
                            class: 'deposit',
                            translatedText: 'main.entrar',
                            eventKey: 'entrar',
                            buttonType: 'text',
                            style: {
                              marginTop: '1.4375rem',
                              '--padding-top': '0.875rem',
                              '--padding-bottom': '0.875rem',
                            }
                          },
                        ]
                      }
                    ]
                  },
                ]
              },
              {
                position: 'content',
                style: {
                  '--padding-start': '0.875rem',
                  '--padding-end': '0.625rem',
                  '--padding-top': '1.6875rem',
                  '--padding-bottom': '1rem',
                },
                children: [
                  {
                    componentName: 'tabbar_DrawerLeft_hotGame',
                    componentId: 1,
                    layoutType: 'layout2',
                    children: [
                      {
                        componentName: 'tabbar_DrawerLeft_hotGame_title',
                        componentId: 2,
                      },
                      {
                        componentName: 'tabbar_DrawerLeft_hotGame_gameList',
                        componentId: 1,
                        layoutType: 'layout2',
                      },
                    ]
                  },
                  {
                    componentName: 'tabbar_DrawerLeft_activityList',
                    componentId: 1,
                    childComponentKey: 'style1',
                    class: 'line-before',
                    layoutType: 'layout2',
                    style: {
                      gap: '0.375rem',
                      '--line-margin-top': '1.375rem',
                      '--line-margin-bottom': '0.5rem',
                      '--line-color': 'var(--ep-color-border-default)',
                    },
                  },
                  {
                    componentName: 'BonusPool',
                    componentId: 2,
                    layoutType: 'layout2',
                    class: 'background-border-top',
                    style: {
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      '--border-color1': 'var(--ep-color-border-default)',
                    },
                    imageList: [
                      {
                        name: 'icon1',
                        id: 1,
                      }
                    ]
                  },
                  {
                    componentName: 'tabbar_DrawerLeft_nav',
                    componentId: 1,
                    class: 'line-before',
                    style: {
                      '--line-margin-top': '0.75rem',
                      '--line-margin-bottom': '0.875rem',
                      '--line-color': 'var(--ep-color-border-default)',
                    },
                  },
                  {
                    componentName: 'tabbar_DrawerLeft_customerService',
                    componentId: 3,
                    style: {
                      marginTop: '0.375rem',
                    },
                    imageList: [
                      {
                        name: 'icon1',
                        id: 3,
                      }
                    ]
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
            class: 'border-top',
            style: {
              '--padding-end': '0.75rem',
              '--border-color': 'linear-gradient(90deg, rgba(10, 119, 218, 0.00) 0%, rgba(10, 119, 218, 0.00) 25%, var(--ep-color-border-brand, #0A77DA) 50%, rgba(10, 119, 218, 0.00) 75%, rgba(10, 119, 218, 0.00) 100%)',
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
                layoutType: 'layout2',
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
            componentName: 'tabbar_inicio_SwiperView',
            componentId: 1,
            style: {
              height: '10.625rem',
              borderRadius: '0',
            },
          },
          {
            componentName: 'tabbar_inicio_MarqueeView',
            componentId: 1,
            style: {
              padding: '0 0.75rem',
              marginTop: '0.875rem',
              height: '2.5rem',
            },
            children: [
              {
                componentName: 'tabbar_inicio_MarqueeView_marquee',
                componentId: 1,
                style: {
                  paddingRight: '0.4375rem',
                  borderRadius: 'var(--ep-border-radius-m)',
                  '--text-color': 'var(--ep-color-text-success)',
                  background: 'var(--ep-color-background-fill-surface-raised-L2)',
                  border: '0.0625rem solid var(--ep-color-border-default)',
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
                    layoutType: 'layout3',
                    imageList: [
                      {
                        name: 'icon1',
                        id: 2,
                      }
                    ]
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
                  '--border-radius': 'var(--ep-border-radius-m)',
                },
                iconStyle: {
                  fontSize: '1.5rem',
                  color: 'var(--ep-color-icon-brand-primary)',
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
            componentName: 'tabbar_layout_contentBox',
            componentId: 1,
            layoutType: 'layout2',
            style: {
              marginTop: '0.875rem',
              padding: '0.6875rem 0.75rem 1.8125rem',
            },
            imageList: [
              {
                name: 'icon1',
                id: 1,
              }
            ],
            children: [
              {
                componentName: 'tabbar_layout_contentBox',
                componentId: 1,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_userInfo_account',
                    componentId: 1,
                    imageList: [
                      {
                        name: 'icon1',
                        id: 1,
                      }
                    ]
                  },
                  {
                    componentName: 'tabbar_inicio_HeaderBar_assets',
                    componentId: 3,
                    currencyStyle: {
    
                    },
                    numberStyle: {
    
                    },
                    imageList: [
                      {
                        name: 'icon2',
                        id: 1
                      }
                    ],
                    
                  },
                  {
                    componentName: 'tabbar_inicio_HeaderBar_buttonWrap',
                    componentId: 1,
                    layoutType: 'layout2',
                    children: [
                      {
                        componentName: 'tabbar_inicio_loginButton',
                        componentId: 1,
                        class: 'login',
                        translatedText: 'main.login',
                        eventKey: 'login',
                      },
                      {
                        componentName: 'tabbar_inicio_HeaderBar_registerButton',
                        componentId: 1,
                        class: 'register'
                      }
                    ]
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_userInfo_cardWrap',
                componentId: 1,
                listMaps: ['entrar', 'withdraw', 'vip', 'promo'],
                style: {
                  marginTop: '1.5625rem',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_userInfo_cardButton',
                    componentId: 1,
                    imageList: [
                      {
                        name: 'icon1',
                        id: 1,
                      }
                    ]
                  }
                ]
              }
            ]
          },
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
              {
                componentName: 'tabbar_inicio_Segment_segmentLayout',
                noHot: true,
                componentId: 2,
                eventKey: 'goToCategory',
                style: {
                  paddingTop: '0.25rem',
                  borderRadius: '0',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_Segment_nav',
                    componentId: 6,
                    imageList: [
                      {
                        name: 'icon1',
                        id: 4,
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
                isShowAll: true,
              },
              style2: {
                size: 12,
                row: 3,
                hotSize: 16,
                hotRow: 4,
                isShowAll: true,
              },
              style3: {
                size: 12,
                row: 4,
                hotSize: 15,
                hotRow: 5,
                isShowAll: true,
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
                    class: 'border-top border-bottom',
                    style: {
                      marginTop: '1.5625rem',
                      marginBottom: '0.9375rem',
                      padding: '0 0.75rem',
                      minHeight: '3.125rem',
                      '--border-color2': 'var(--ep-color-border-default)',
                      '--border-color1': 'linear-gradient(90deg, rgba(10, 119, 218, 0.00) 0%, var(--ep-color-border-brand, #0A77DA) 20%, rgba(10, 119, 218, 0.00) 30%)',
                    },
                    children: [
                      {
                        componentName: 'tabbar_inicio_GameWrapper_WrapperHead_start',
                        componentId: 2,
                        styleId: 'svg-theme-color2',
                      },
                      {
                        componentName: 'tabbar_inicio_GameWrapper_WrapperHead_center',
                        componentId: 4,
                      }
                    ]
                  },
                  
                ]
              },
            ]
          },
          {
            componentName: 'tabbar_inicio_Segment',
            componentId: 2,
            eventKey: 'goToCategory',
            negateCategoryType: true,
            children: [
              {
                componentName: 'tabbar_inicio_GameWrapper_Header',
                componentId: 1,
                class: 'border-top border-bottom',
                style: {
                  marginTop: '1.75rem',
                  padding: '0 0.75rem',
                  minHeight: '3.125rem',
                  '--border-color2': 'var(--ep-color-border-default)',
                  '--border-color1': 'linear-gradient(90deg, rgba(10, 119, 218, 0.00) 0%, var(--ep-color-border-brand, #0A77DA) 20%, rgba(10, 119, 218, 0.00) 30%)',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_GameWrapper_Header_start',
                    componentId: 2,
                  },
                  {
                    componentName: 'tabbar_inicio_GameWrapper_Header_end',
                    componentId: 1,
                    layoutType: 'layout2',
                    imageList: [
                      {
                        name: 'icon1',
                        id: 2,
                      }
                    ]
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_Segment_segmentLayout',
                componentId: 5,
                noHot: true,
                eventKey: 'goToCategory',
                style: {
                  padding: '0.75rem 0 1.125rem',
                },
                children: [
                  {
                    componentName: 'tabbar_inicio_Segment_nav',
                    componentId: 6,
                    imageList: [
                      {
                        name: 'icon1',
                        id: 4,
                      },
                    ]
                  },
                ]
              },
              {
                componentName: 'tabbar_inicio_Segment_segmentLayout',
                componentId: 6,
                eventKey: 'goToCategory',
                slidesPerView: 4,
                style: {
                  padding: '0.75rem 0 1.125rem',
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
          {
            componentName: 'tabbar_inicio_video',
            componentId: 1,
            style: {
              margin: '3.0625rem 0.75rem 0',
            },
          },
          {
            componentName: 'tabbar_inicio_Ranking',
            componentId: 1,
            style: {
              margin: '2.5rem auto 0',
            },
            imageList: [
              {
                name: 'icon1',
                id: 2,
              }
            ],
           
          },
          {
            componentName: 'tabbar_layout_contentBox',
            componentId: 1,
            layoutType: 'layout3',
            style: {
              minHeight: '21rem',
              margin: '4.5625rem 0.75rem 0',
              padding: '1.6875rem 1rem 1.375rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
            imageList: [
              {
                name: 'icon1',
                id: 2,
              }
            ],
            children: [
              {
                componentName: 'tabbar_inicio_AppInstall_badge',
                componentId: 1,
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_AppInstall_introduction',
                componentId: 1,
                style: {
                  marginTop: '1.25rem',
                  marginBottom: 'auto',
                },
              },
              {
                componentName: 'tabbar_inicio_AppInstall',
                componentId: 2,
                style: {
                  '--border-color2': 'linear-gradient(90deg, rgba(10, 119, 218, 0.00) 0%, rgba(10, 119, 218, 0.00) 10%, var(--ep-color-border-brand, #0A77DA) 50%, rgba(10, 119, 218, 0.00) 90%, rgba(10, 119, 218, 0.00) 100%)',
                },
                iosClass: 'background-border-bottom',
                androidClass: 'background-border-bottom',
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
            componentName: 'tabbar_inicio_PartView_paymentPartner',
            componentId: 2,
            style: {
              marginTop: '6.0625rem',
            },
          },
          {
            componentName: 'tabbar_inicio_FooterContent',
            componentId: 1,
            style: {
              marginTop: '2.6875rem',
              textAlign: 'center',
              padding: '2.625rem 0.75rem 6.25rem',
              background: 'var(--ep-color-background-fill-surface-raised-L1)',
            },
            children: [
              {
                componentName: 'tabbar_inicio_FooterContent_introduction',
                componentId: 1,
                style: {
                  margin: '0 0.9375rem',
                },
              },
              {
                componentName: 'tabbar_layout_contentBox',
                componentId: 1,
                style: {
                  marginTop: '2.1875rem',
                  padding: '0.6875rem 0.75rem 0.875rem 1.1875rem',
                  border: '0.0625rem dashed var(--ep-color-border-default)',
                  display: 'inline-flex',
                  gap: '2rem',
                },
                children: [
                  {
                    componentName: 'lazyImages',
                    componentId: 1,
                    style: {
                      height: '1.6875rem',
                    },
                    imageList: [
                      {
                        name: 'icon1',
                        id: 1,
                      }
                    ]
                  },
                  {
                    componentName: 'lazyImages',
                    componentId: 1,
                    style: {
                      height: '1.6875rem',
                    },
                    imageList: [
                      {
                        name: 'icon1',
                        id: 2,
                      }
                    ]
                  },
                ]
              },
              {
                componentName: 'tabbar_inicio_FooterContent_badge',
                componentId: 1,
                style: {
                  marginTop: '3rem',
                },
                imageList: [
                  {
                    name: 'icon1',
                    id: 1,
                  },
                  {
                    name: 'icon2',
                    id: 1,
                  },
                  {
                    name: 'icon3',
                    id: 1,
                  }
                ]
              },
              {
                componentName: 'tabbar_inicio_FooterContent_logo',
                componentId: 1,
                style: {
                  marginTop: '3.875rem',
                  height: '3.125rem',
                },
              },
              {
                componentName: 'tabbar_inicio_FooterContent_version',
                componentId: 1,
                style: {
                  marginTop: '0.8125rem',
                },
              },
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
        ],
      }
    ],
  }
}


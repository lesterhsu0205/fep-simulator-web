-- 1) 第一層（level = 1, parent_id = NULL）
INSERT INTO functions(id, code, name, url, parent_id, level, sort_order) VALUES
  (100, 'SYS_FUNC_MGMT',      '系統功能管理',       NULL,  NULL, 1, 10),
  (110, 'TEST_SCENARIO_MGMT', '測試情境管理',       NULL,  NULL, 1, 20),
  (120, 'TEST_ACCT_MGMT',     '測試帳號管理',       NULL,  NULL, 1, 30),
  (130, 'SIM_FINANCE_MGMT',   '模擬財金管理',       NULL,  NULL, 1, 40),
  (140, 'AUTO_FINANCE_MGMT',  '自主財金管理',       NULL,  NULL, 1, 50);

-- 2) 第二層（level = 2）
INSERT INTO functions(id, code, name, url, parent_id, level, sort_order) VALUES
  /* 系統功能管理 (100) */
  (101, 'USER_MAINT',          '使用者維護',        '/api/users',                    100, 2, 10),
  (102, 'ROLE_MAINT',          '角色維護',          '/api/roles',                    100, 2, 20),

  /* 測試情境管理 (110) */
  (201, 'COMMON_FUNC',         '共用功能',          NULL,                             110, 2, 10),
  (202, 'CREDIT_SCENARIO_MGMT','聯徵情境管理',     NULL,                             110, 2, 20),
  (203, 'FINANCE_SCENARIO_MGMT','財金情境管理',     NULL,                             110, 2, 30),

  /* 測試帳號管理 (120) */
  (241, 'TEST_ACCT_MAINT',     '測試帳號維護',      '/api/test/accounts',            120, 2, 10),
  (242, 'TEST_ACCT_CREATE',    '測試帳號建立',      '/api/test/accounts/create',     120, 2, 20),

  /* 模擬財金管理 (130) */
  (301, 'TXN_DETAIL_QUERY',    '交易明細查詢',      '/api/transactions',             130, 2, 10),
  (302, 'CROSSBANK_IN_TXN',    '跨行匯款匯入交易',  '/api/transactions/cross-in',    130, 2, 20),
  (303, 'CROSSBANK_PROXY_TXN', '跨行被代理交易',    '/api/transactions/proxy',       130, 2, 30),
  (304, 'FXML_IN_TXN',         'FXML入金交易',      '/api/transactions/fxml',        130, 2, 40),

  /* 自主財金管理 (140) */
  (401, 'SELF_TXN_QUERY',      '交易明細查詢',      '/api/self/transactions',        140, 2, 10),
  (402, 'CHIP_CARD_DATA_MGMT', '晶片卡資料管理',    '/api/self/cards',               140, 2, 20),
  (403, 'SELF_CROSSBANK_PROXY_TXN','跨行被代理交易','/api/self/transactions/proxy',140, 2, 30);

-- 3) 第三層（level = 3）
INSERT INTO functions(id, code, name, url, parent_id, level, sort_order) VALUES
  /* 共用功能 (201) */
  (211, 'RECORD_QUERY',           '收送紀錄查詢',      '/api/logs',                   201, 3, 10),

  /* 聯徵情境管理 (202) */
  (221, 'CREDIT_HTML_INQ',        '聯徵中心 HTML 發查', '/api/credit/html',            202, 3, 10),
  (222, 'CREDIT_RAWDATA_INQ',     '聯徵中心 RawData 發查','/api/credit/raw',           202, 3, 20),
  (223, 'CREDIT_FILE_UPLOAD',     '檔案上傳',          '/api/credit/upload',          202, 3, 30),

  /* 財金情境管理 (203) */
  (231, 'TEST_SCENARIO_MAINT',    '測試情境維護',      '/api/finance/scenario/maint', 203, 3, 10),
  (232, 'TEST_SCENARIO_CREATE',   '測試情境建立',      '/api/finance/scenario/create',203, 3, 20),
  (233, 'FINANCE_FILE_UPLOAD',    '檔案上傳',          '/api/finance/scenario/upload',203, 3, 30),
  (234, 'INCOMPLETE_SCEN_MAINT',  '未完成查詢情境維護','/api/finance/scenario/incomplete/maint',203,3,40),
  (235, 'INCOMPLETE_SCEN_CREATE', '未完成查詢情境建立','/api/finance/scenario/incomplete/create',203,3,50);
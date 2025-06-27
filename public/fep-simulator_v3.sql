-- public.account_list definition

-- Drop table

-- DROP TABLE account_list;

CREATE TABLE account_list (
	id bigserial NOT NULL,
	account varchar(16) NOT NULL,
	status varchar(1) NOT NULL,
	"type" varchar(2) NOT NULL,
	ic_no varchar(8) NOT NULL,
	ic_momo varchar(60) NOT NULL,
	ic_c6key varchar(48) NOT NULL,
	creator varchar(100) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updater varchar(100) NOT NULL,
	update_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT account_list_pkey PRIMARY KEY (id),
	CONSTRAINT idx_account UNIQUE (account)
);


-- errorcode definition

-- Drop table

-- DROP TABLE errorcode;

CREATE TABLE errorcode (
	codeid bigserial NOT NULL,
	errorcode varchar(5) NOT NULL,
	description varchar(100) NULL,
	CONSTRAINT errorcode_pkey PRIMARY KEY (codeid)
);


-- fisc_situation definition

-- Drop table

-- DROP TABLE fisc_situation;

CREATE TABLE fisc_situation (
	id bigserial NOT NULL,
	account varchar(16) NOT NULL,
	situation_desc varchar(16) NOT NULL,
	memo varchar(100) NULL,
	is_rmt bool NULL,
	rmt_result_code varchar(5) NULL,
	is_atm bool NULL,
	atm_result_code varchar(5) NULL,
	atm_verify bool NULL,
	atm_verify_result_code varchar(5) NULL,
	atm_verify_result_detail varchar(5) NULL,
	is_fxml bool NULL,
	fxml_result_code varchar(5) NULL,
	creator varchar(100) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updater varchar(100) NULL,
	update_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT fisc_situation_pkey PRIMARY KEY (id),
	CONSTRAINT idx_acount UNIQUE (account)
);


-- roles definition

-- Drop table

-- DROP TABLE roles;

CREATE TABLE roles (
	id bigserial NOT NULL,
	code varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	CONSTRAINT idx_roles_code UNIQUE (code),
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);


-- tx_log definition

-- Drop table

-- DROP TABLE tx_log;

CREATE TABLE tx_log (
	log_datetime timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	system_type varchar(5) NOT NULL,
	txn_type varchar(5) NOT NULL,
	txn_id varchar(5) NOT NULL,
	guid varchar(32) NOT NULL,
	itaiguidqmsgid varchar(32) NOT NULL,
	"uuid" varchar(32) NOT NULL,
	txn_data jsonb NOT NULL,
	CONSTRAINT idx_uuid UNIQUE (uuid),
	CONSTRAINT tx_log_pk PRIMARY KEY (log_datetime)
);
CREATE INDEX idx_guid ON tx_log USING btree (guid);
CREATE INDEX idx_itaiguidqmsgid ON tx_log USING btree (itaiguidqmsgid);


-- txmsglayout definition

-- Drop table

-- DROP TABLE txmsglayout;

CREATE TABLE txmsglayout (
	systemtype varchar(3) NOT NULL,
	txdirection varchar(1) NULL,
	txtype varchar(1) NULL,
	layouttype varchar(2) NOT NULL,
	transactioncode varchar(8) NULL,
	fieldname varchar(30) NULL,
	length varchar(4) NULL,
	"datatype" varchar(10) NULL,
	description varchar(256) NULL,
	CONSTRAINT txmsglayout_pk PRIMARY KEY (systemtype, layouttype)
);


-- users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	id bigserial NOT NULL,
	username varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	account_type varchar(20) NOT NULL,
	is_active bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	update_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT idx_username UNIQUE (username),
	CONSTRAINT users_account_type_check CHECK (((account_type)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying, 'system'::character varying])::text[]))),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- auth_tokens definition

-- Drop table

-- DROP TABLE auth_tokens;

CREATE TABLE auth_tokens (
	id bigserial NOT NULL,
	user_id int8 NOT NULL,
	token_jti varchar(255) NOT NULL,
	token_type varchar(20) NOT NULL,
	client_type varchar(20) NOT NULL,
	issued_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	expires_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	revoked bool DEFAULT false NOT NULL,
	CONSTRAINT auth_tokens_client_type_check CHECK (((client_type)::text = ANY ((ARRAY['human'::character varying, 'system'::character varying])::text[]))),
	CONSTRAINT auth_tokens_pkey PRIMARY KEY (id),
	CONSTRAINT auth_tokens_token_type_check CHECK (((token_type)::text = ANY ((ARRAY['access'::character varying, 'refresh'::character varying])::text[]))),
	CONSTRAINT idx_token_jti UNIQUE (token_jti),
	CONSTRAINT auth_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- "functions" definition

-- Drop table

-- DROP TABLE "functions";

CREATE TABLE "functions" (
	id int4 NOT NULL,
	code varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	url varchar(200) NULL,
	parent_id int4 NULL,
	"level" int2 DEFAULT 1 NOT NULL,
	sort_order int2 DEFAULT 0 NOT NULL,
	CONSTRAINT functions_code_key UNIQUE (code),
	CONSTRAINT functions_pkey PRIMARY KEY (id),
	CONSTRAINT fk_functions_parent FOREIGN KEY (parent_id) REFERENCES "functions"(id) ON DELETE SET NULL
);
CREATE INDEX idx_functions_level ON functions USING btree (level);
CREATE INDEX idx_functions_parent ON functions USING btree (parent_id);


-- role_functions definition

-- Drop table

-- DROP TABLE role_functions;

CREATE TABLE role_functions (
	role_id int8 NOT NULL,
	function_id int8 NOT NULL,
	CONSTRAINT role_functions_pkey PRIMARY KEY (role_id, function_id),
	CONSTRAINT role_functions_function_id_fkey FOREIGN KEY (function_id) REFERENCES "functions"(id) ON DELETE CASCADE,
	CONSTRAINT role_functions_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);


-- user_roles definition

-- Drop table

-- DROP TABLE user_roles;

CREATE TABLE user_roles (
	user_id int8 NOT NULL,
	role_id int8 NOT NULL,
	assigned_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
	CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
	CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
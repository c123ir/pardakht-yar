--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: mojtabahassani
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'PAID',
    'REJECTED'
);


ALTER TYPE public."PaymentStatus" OWNER TO mojtabahassani;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: mojtabahassani
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'FINANCIAL_MANAGER',
    'ACCOUNTANT',
    'SELLER',
    'CEO',
    'PROCUREMENT'
);


ALTER TYPE public."Role" OWNER TO mojtabahassani;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."Contact" (
    id integer NOT NULL,
    "companyName" text NOT NULL,
    "contactPerson" text,
    phone text,
    email text,
    address text,
    "nationalId" text,
    "economicCode" text,
    description text,
    "bankInfo" jsonb,
    "accessToken" text,
    "ceoName" text,
    "accountantName" text,
    "accountantPhone" text,
    "creatorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "fieldOfActivity" text
);


ALTER TABLE public."Contact" OWNER TO mojtabahassani;

--
-- Name: ContactPortalActivity; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."ContactPortalActivity" (
    id integer NOT NULL,
    "contactId" integer NOT NULL,
    "paymentId" integer,
    action text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    feedback text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContactPortalActivity" OWNER TO mojtabahassani;

--
-- Name: ContactPortalActivity_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."ContactPortalActivity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ContactPortalActivity_id_seq" OWNER TO mojtabahassani;

--
-- Name: ContactPortalActivity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."ContactPortalActivity_id_seq" OWNED BY public."ContactPortalActivity".id;


--
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."Contact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contact_id_seq" OWNER TO mojtabahassani;

--
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- Name: GroupMember; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."GroupMember" (
    id integer NOT NULL,
    "groupId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GroupMember" OWNER TO mojtabahassani;

--
-- Name: GroupMember_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."GroupMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."GroupMember_id_seq" OWNER TO mojtabahassani;

--
-- Name: GroupMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."GroupMember_id_seq" OWNED BY public."GroupMember".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    "paymentId" integer NOT NULL,
    "recipientType" text NOT NULL,
    "recipientId" integer NOT NULL,
    message text NOT NULL,
    method text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO mojtabahassani;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notification_id_seq" OWNER TO mojtabahassani;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: PaymentImage; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."PaymentImage" (
    id integer NOT NULL,
    "paymentId" integer NOT NULL,
    "fileName" text NOT NULL,
    "filePath" text NOT NULL,
    "thumbnailPath" text,
    "originalName" text,
    "mimeType" text,
    size integer,
    "hasWatermark" boolean DEFAULT true NOT NULL,
    "uploaderId" integer NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PaymentImage" OWNER TO mojtabahassani;

--
-- Name: PaymentImage_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."PaymentImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PaymentImage_id_seq" OWNER TO mojtabahassani;

--
-- Name: PaymentImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."PaymentImage_id_seq" OWNED BY public."PaymentImage".id;


--
-- Name: PaymentRequest; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."PaymentRequest" (
    id integer NOT NULL,
    title text NOT NULL,
    amount bigint NOT NULL,
    "effectiveDate" timestamp(3) without time zone NOT NULL,
    description text,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paymentType" text,
    "groupId" integer,
    "contactId" integer,
    "beneficiaryName" text,
    "beneficiaryPhone" text,
    "isSMSSent" boolean DEFAULT false NOT NULL,
    "smsSentAt" timestamp(3) without time zone,
    "paymentDate" timestamp(3) without time zone,
    "paidById" integer,
    "creatorId" integer NOT NULL,
    "updaterId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PaymentRequest" OWNER TO mojtabahassani;

--
-- Name: PaymentRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."PaymentRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PaymentRequest_id_seq" OWNER TO mojtabahassani;

--
-- Name: PaymentRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."PaymentRequest_id_seq" OWNED BY public."PaymentRequest".id;


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."Setting" (
    id integer NOT NULL,
    category text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Setting" OWNER TO mojtabahassani;

--
-- Name: Setting_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."Setting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Setting_id_seq" OWNER TO mojtabahassani;

--
-- Name: Setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."Setting_id_seq" OWNED BY public."Setting".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "fullName" text NOT NULL,
    email text,
    phone text,
    role public."Role" DEFAULT 'ADMIN'::public."Role" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO mojtabahassani;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO mojtabahassani;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO mojtabahassani;

--
-- Name: payment_groups; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.payment_groups (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    color text,
    "creatorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payment_groups OWNER TO mojtabahassani;

--
-- Name: payment_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.payment_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_groups_id_seq OWNER TO mojtabahassani;

--
-- Name: payment_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.payment_groups_id_seq OWNED BY public.payment_groups.id;


--
-- Name: request_activities; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.request_activities (
    id integer NOT NULL,
    "requestId" integer NOT NULL,
    "userId" integer NOT NULL,
    action text NOT NULL,
    details jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.request_activities OWNER TO mojtabahassani;

--
-- Name: request_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.request_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_activities_id_seq OWNER TO mojtabahassani;

--
-- Name: request_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.request_activities_id_seq OWNED BY public.request_activities.id;


--
-- Name: request_attachments; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.request_attachments (
    id integer NOT NULL,
    "requestId" integer NOT NULL,
    "filePath" text NOT NULL,
    "fileType" text NOT NULL,
    "fileName" text NOT NULL,
    "uploadedBy" integer NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.request_attachments OWNER TO mojtabahassani;

--
-- Name: request_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.request_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_attachments_id_seq OWNER TO mojtabahassani;

--
-- Name: request_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.request_attachments_id_seq OWNED BY public.request_attachments.id;


--
-- Name: request_groups; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.request_groups (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "requestTypeId" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.request_groups OWNER TO mojtabahassani;

--
-- Name: request_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.request_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_groups_id_seq OWNER TO mojtabahassani;

--
-- Name: request_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.request_groups_id_seq OWNED BY public.request_groups.id;


--
-- Name: request_sub_groups; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.request_sub_groups (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "groupId" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.request_sub_groups OWNER TO mojtabahassani;

--
-- Name: request_sub_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.request_sub_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_sub_groups_id_seq OWNER TO mojtabahassani;

--
-- Name: request_sub_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.request_sub_groups_id_seq OWNED BY public.request_sub_groups.id;


--
-- Name: request_types; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.request_types (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "fieldConfig" jsonb NOT NULL,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    color text,
    "iconName" text
);


ALTER TABLE public.request_types OWNER TO mojtabahassani;

--
-- Name: request_types_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.request_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_types_id_seq OWNER TO mojtabahassani;

--
-- Name: request_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.request_types_id_seq OWNED BY public.request_types.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: mojtabahassani
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    "requestTypeId" integer NOT NULL,
    title text NOT NULL,
    description text,
    amount double precision,
    "effectiveDate" timestamp(3) without time zone,
    "beneficiaryName" text,
    "beneficiaryPhone" text,
    "contactId" integer,
    "groupId" integer,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "creatorId" integer NOT NULL,
    "assigneeId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "subGroupId" integer
);


ALTER TABLE public.requests OWNER TO mojtabahassani;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: mojtabahassani
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requests_id_seq OWNER TO mojtabahassani;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mojtabahassani
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- Name: ContactPortalActivity id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."ContactPortalActivity" ALTER COLUMN id SET DEFAULT nextval('public."ContactPortalActivity_id_seq"'::regclass);


--
-- Name: GroupMember id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."GroupMember" ALTER COLUMN id SET DEFAULT nextval('public."GroupMember_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: PaymentImage id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentImage" ALTER COLUMN id SET DEFAULT nextval('public."PaymentImage_id_seq"'::regclass);


--
-- Name: PaymentRequest id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest" ALTER COLUMN id SET DEFAULT nextval('public."PaymentRequest_id_seq"'::regclass);


--
-- Name: Setting id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Setting" ALTER COLUMN id SET DEFAULT nextval('public."Setting_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: payment_groups id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.payment_groups ALTER COLUMN id SET DEFAULT nextval('public.payment_groups_id_seq'::regclass);


--
-- Name: request_activities id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_activities ALTER COLUMN id SET DEFAULT nextval('public.request_activities_id_seq'::regclass);


--
-- Name: request_attachments id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_attachments ALTER COLUMN id SET DEFAULT nextval('public.request_attachments_id_seq'::regclass);


--
-- Name: request_groups id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_groups ALTER COLUMN id SET DEFAULT nextval('public.request_groups_id_seq'::regclass);


--
-- Name: request_sub_groups id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_sub_groups ALTER COLUMN id SET DEFAULT nextval('public.request_sub_groups_id_seq'::regclass);


--
-- Name: request_types id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_types ALTER COLUMN id SET DEFAULT nextval('public.request_types_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."Contact" (id, "companyName", "contactPerson", phone, email, address, "nationalId", "economicCode", description, "bankInfo", "accessToken", "ceoName", "accountantName", "accountantPhone", "creatorId", "createdAt", "updatedAt", "fieldOfActivity") FROM stdin;
1	سشیب	\N	\N		شسیب	\N	\N	\N	{"iban": "", "bankName": "", "cardNumber": "", "accountOwner": "", "accountNumber": ""}	e7e0877f-ec7e-49a6-94f6-58ebd16b22c3			\N	2	2025-03-19 06:02:45.114	2025-03-19 06:02:45.114	سشیب
2	یک دو سه	\N	\N	123.hasani@gmail.com	کرمان	\N	\N	\N	{"iban": "", "bankName": "", "cardNumber": "", "accountOwner": "", "accountNumber": ""}	fce566ff-5de0-464b-a8ab-1734bbc461b7	مجتبی حسنی	یزدانپناه	09132323123	2	2025-03-19 06:54:48.28	2025-03-19 06:54:48.28	فروش لپ تاپ
\.


--
-- Data for Name: ContactPortalActivity; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."ContactPortalActivity" (id, "contactId", "paymentId", action, "ipAddress", "userAgent", feedback, "createdAt") FROM stdin;
\.


--
-- Data for Name: GroupMember; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."GroupMember" (id, "groupId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."Notification" (id, "paymentId", "recipientType", "recipientId", message, method, status, "sentAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: PaymentImage; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."PaymentImage" (id, "paymentId", "fileName", "filePath", "thumbnailPath", "originalName", "mimeType", size, "hasWatermark", "uploaderId", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: PaymentRequest; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."PaymentRequest" (id, title, amount, "effectiveDate", description, status, "paymentType", "groupId", "contactId", "beneficiaryName", "beneficiaryPhone", "isSMSSent", "smsSentAt", "paymentDate", "paidById", "creatorId", "updaterId", "createdAt", "updatedAt") FROM stdin;
1	سیبسیب	2	2025-02-26 20:30:00	صیبیب	PENDING	\N	\N	\N	\N	\N	f	\N	\N	\N	2	2	2025-03-19 05:30:29.313	2025-03-19 05:30:29.313
2	سیبسیب	2	2025-02-26 20:30:00	صیبیب	PENDING	\N	\N	\N	سیبسیب	\N	f	\N	\N	\N	2	2	2025-03-19 05:30:39.369	2025-03-19 05:30:39.369
3	122	122	2025-03-04 20:30:00	121221	PENDING	\N	\N	\N	\N	\N	f	\N	\N	\N	2	2	2025-03-19 05:48:35.476	2025-03-19 05:48:35.476
4	مهر بانو	1	2025-03-04 20:30:00	لیبسل	PENDING	\N	\N	\N	\N	\N	f	\N	\N	\N	2	2	2025-03-19 06:04:26.117	2025-03-19 06:04:26.117
5	fsf	23	2025-02-26 20:30:00	dsf	PENDING	\N	\N	\N	\N	\N	f	\N	\N	\N	2	2	2025-03-19 06:55:31.007	2025-03-19 06:55:31.007
6	fsf	23	2025-02-26 20:30:00	dsf	PENDING	\N	\N	\N	dfs	\N	f	\N	\N	\N	2	2	2025-03-19 06:55:38.893	2025-03-19 06:55:38.893
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."Setting" (id, category, key, value, "createdAt", "updatedAt") FROM stdin;
1	SMS	sms_settings	{"provider":"0098sms","username":"zsms8829","password":"j494moo*O^HU","from":"3000164545","isActive":true}	2025-03-19 09:05:10.396	2025-03-19 14:56:53.591
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public."User" (id, username, password, "fullName", email, phone, role, "isActive", "lastLogin", "createdAt", "updatedAt") FROM stdin;
4	demouser	$2a$10$lqMITkIAVfIe0xBeoCiDx.3sJxHtI9/Mrqc44LaRZalgBuZskKCAy	کاربر دمو	demo@example.com	0912345678930	ADMIN	t	\N	2025-03-19 06:50:18.56	2025-03-19 11:35:19.517
2	admin	$2a$10$qRG96CXqz4EjepppGPAm5OkrxRyO3pguj6rfwU1bzgVhUC8fCdPJq	مجتبی حسنی	123.hasani@gmail.com	09120540123	ADMIN	t	2025-03-19 21:10:41.842	2025-03-19 05:29:46.53	2025-03-19 21:10:41.843
1	testadmin	$2b$10$0m6vnQ3twP50R8WkRROorer6N7XCNEphSxvP/eR69w0hYsItcfAFe	کاربر آزمایشی	test@example.com	09123456789	ADMIN	t	2025-03-19 09:03:51.102	2025-03-19 05:28:39.038	2025-03-19 09:03:51.103
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
efb92fca-7666-4710-9e87-46e2a84f1dbb	51a3151a1c49cc09121fd3219ca1d9cc69f618362f64b8ddd2da9fad36e4da36	2025-03-19 08:25:21.863593+03:30	20250318123245_init	\N	\N	2025-03-19 08:25:21.803565+03:30	1
e109bf7b-146d-4b3d-8e94-de0319ccc7d9	5ea9761cb4712608ce1d396b60d299b837163b33dd789033382ec0d077fd8e64	2025-03-19 08:25:21.893603+03:30	20250318150358_add_mobile_verification	\N	\N	2025-03-19 08:25:21.864593+03:30	1
8b30026a-6ed7-493c-bf85-a7b38bd824e6	04740207ef2bbf80510d5cc91505c7103105cfcabdc75600fd48b11612c63435	2025-03-19 08:25:21.922354+03:30	20250318154906_add_contact_model	\N	\N	2025-03-19 08:25:21.894237+03:30	1
7f090568-e2bb-4195-85a7-d7d2338458d5	ac70dae91795f6b54b1d0e4dd5455ec7b2e823afabeac6ffd74ade03fa0c5693	2025-03-19 08:25:22.012447+03:30	20250319045357_add_request_models	\N	\N	2025-03-19 08:25:21.923221+03:30	1
1339d696-0a83-4cb5-851e-5ff593caf8c9	a127a1302b05b14fb8d80f9fed1b9fc29dc914f715a0e6e24a51ba7a0c451180	2025-03-19 08:43:09.367048+03:30	20250319051309_add_contact_fields	\N	\N	2025-03-19 08:43:09.337496+03:30	1
a90831b1-4a27-4bd8-9404-767d6ed5c658	d73051404be6e843a95636331bc933e1dee8e4cdfe8efdd27356bd1a9cc145c2	2025-03-19 08:43:46.648344+03:30	20250319051346_add_field_of_activity	\N	\N	2025-03-19 08:43:46.628629+03:30	1
48ac9d66-a4d9-4aff-9d39-4e9ca89704d6	3b8627a36103dfe5917fbb34d5351bc91d430f88fe9c3bc11c5b0c7d6ffbd2a3	2025-03-19 09:54:35.37795+03:30	20250319062435_add_request_groups	\N	\N	2025-03-19 09:54:35.326526+03:30	1
6c9a6f51-28a0-4449-afb5-9f185bea1fbe	28482ed9cc40a636cff3dde4ac4713e2a7a33c36eab03e78d1bd1c0d4ccbdec7	2025-03-19 13:49:32.454106+03:30	20250319101932_add_icon_and_color_to_request_type	\N	\N	2025-03-19 13:49:32.430328+03:30	1
\.


--
-- Data for Name: payment_groups; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.payment_groups (id, title, description, color, "creatorId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: request_activities; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.request_activities (id, "requestId", "userId", action, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: request_attachments; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.request_attachments (id, "requestId", "filePath", "fileType", "fileName", "uploadedBy", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: request_groups; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.request_groups (id, name, description, "requestTypeId", "isActive", "createdBy", "createdAt", "updatedAt") FROM stdin;
1	گروه شمار یک	توضیحاتتت	7	t	1	2025-03-19 08:54:45.127	2025-03-19 08:54:45.127
2	تست		5	t	1	2025-03-19 08:55:55.75	2025-03-19 08:55:55.75
3	شبیبش	شبشیب	5	t	1	2025-03-19 08:56:18.885	2025-03-19 08:56:18.885
\.


--
-- Data for Name: request_sub_groups; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.request_sub_groups (id, name, description, "groupId", "isActive", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: request_types; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.request_types (id, name, description, "isActive", "fieldConfig", "createdBy", "createdAt", "updatedAt", color, "iconName") FROM stdin;
2	درخواست پرداخت به ذینفع	درخواست پرداخت به شخص ذینفع بدون نیاز به طرف‌حساب	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": true}, "groupId": {"label": "گروه", "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": false, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": true}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": true}}	1	2025-03-19 05:42:55.183	2025-03-19 05:42:55.183	\N	\N
3	درخواست خرید	درخواست خرید کالا یا خدمات	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": true}, "vendor": {"label": "فروشنده", "enabled": true, "required": true}, "groupId": {"label": "گروه", "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": false, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "justification": {"label": "توجیه درخواست", "enabled": true, "required": false}, "productDetails": {"label": "جزئیات محصول/خدمات", "enabled": true, "required": true}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": false}}	1	2025-03-19 05:42:55.191	2025-03-19 05:42:55.191	\N	\N
4	درخواست تنخواه	درخواست تنخواه برای هزینه‌های روزمره	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": true}, "groupId": {"label": "گروه", "enabled": false, "required": false}, "purpose": {"label": "هدف", "enabled": true, "required": true}, "contactId": {"label": "طرف‌حساب", "enabled": false, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "dateRequired": {"label": "تاریخ مورد نیاز", "enabled": true, "required": true}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": false}}	1	2025-03-19 05:42:55.198	2025-03-19 05:42:55.198	\N	\N
8	Gharfa-Fanni	بغبغغ	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": false}, "groupId": {"label": "گروه", "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": true, "required": false}, "timeField": {"label": "ساعت", "enabled": false, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "toggleField": {"label": "وضعیت", "enabled": true, "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": false}}	2	2025-03-19 10:21:22.415	2025-03-19 10:50:26.987	#FFB74D	Settings
6	lkng	سشبسیب	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": false}, "groupId": {"label": "گروه", "order": 10, "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": true, "required": false}, "timeField": {"label": "ساعت", "enabled": true, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "toggleField": {"label": "وضعیت", "order": 9, "enabled": true, "options": [], "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": false}}	2	2025-03-19 06:02:18.896	2025-03-19 10:52:54.895	#FFCC80	\N
1	درخواست پرداخت معمولی	درخواست پرداخت استاندارد با همه فیلدها	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": true}, "groupId": {"label": "گروه", "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": true, "required": true}, "timeField": {"label": "ساعت", "order": 9, "enabled": true, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "toggleField": {"label": "وضعیت", "order": 10, "enabled": true, "options": [{"color": "#E3F2FD", "label": "khkhk", "value": "bjjbj"}], "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": false}}	1	2025-03-19 05:42:55.147	2025-03-19 10:55:07.291	#81C784	Today
9	hghg		t	{"title": {"label": "عنوان", "order": 1, "enabled": true, "required": true}, "amount": {"label": "مبلغ", "order": 3, "enabled": true, "required": false}, "groupId": {"label": "گروه", "order": 8, "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "order": 7, "enabled": true, "required": false}, "timeField": {"label": "ساعت", "order": 9, "enabled": true, "required": false}, "description": {"label": "توضیحات", "order": 2, "enabled": true, "required": false}, "toggleField": {"label": "وضعیت", "order": 10, "enabled": true, "options": [{"color": "#FFB74D", "label": "", "value": ""}], "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "order": 4, "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "order": 5, "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "order": 6, "enabled": true, "required": false}}	2	2025-03-19 10:53:24.009	2025-03-19 10:53:24.009	\N	\N
5	درخواست استرداد	درخواست استرداد وجه به مشتری	t	{"title": {"label": "عنوان", "enabled": true, "required": true}, "amount": {"label": "مبلغ", "enabled": true, "required": true}, "reason": {"label": "دلیل استرداد", "enabled": true, "required": true}, "groupId": {"label": "گروه", "order": 9, "enabled": true, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": true, "required": true}, "timeField": {"label": "ساعت", "order": 10, "enabled": true, "required": false}, "description": {"label": "توضیحات", "enabled": true, "required": false}, "toggleField": {"label": "وضعیت", "enabled": true, "options": [{"color": "#E3F2FD", "label": "", "value": ""}, {"color": "#E3F2FD", "label": "", "value": ""}, {"color": "#E3F2FD", "label": "", "value": ""}, {"color": "#E3F2FD", "label": "", "value": ""}], "required": false}, "effectiveDate": {"label": "تاریخ مؤثر", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": true, "required": false}, "beneficiaryPhone": {"label": "شماره تماس ذینفع", "enabled": true, "required": false}, "originalPurchaseDate": {"label": "تاریخ خرید اصلی", "enabled": true, "required": true}, "originalInvoiceNumber": {"label": "شماره فاکتور اصلی", "enabled": true, "required": true}}	1	2025-03-19 05:42:55.206	2025-03-19 12:17:48.51	\N	\N
7	واریز سود سرمایه گذاران	این گروه برای واریز سود سرمایه گذاران است که باید ۳۰ هر ماه واریز شود.	t	{"title": {"label": "نام سرمایه گذار", "enabled": true, "required": true}, "amount": {"label": "سود ماهانه", "enabled": true, "required": false}, "testtt": {"label": "او را من چشم در راهم", "enabled": false, "required": false}, "groupId": {"label": "گروه", "enabled": false, "required": false}, "contactId": {"label": "طرف‌حساب", "enabled": false, "required": false}, "timeField": {"label": "ساعت", "enabled": true, "required": false}, "description": {"label": "توضیح سرمایه گذاری", "enabled": true, "required": false}, "toggleField": {"label": "وضعیت", "enabled": true, "options": [{"color": "#E3F2FD", "label": "", "value": ""}], "required": false}, "effectiveDate": {"label": "تاریخ واریز", "enabled": true, "required": false}, "beneficiaryName": {"label": "نام ذینفع", "enabled": false, "required": false}, "beneficiaryPhone": {"label": "شماره موبایل سرنایه گذار", "enabled": true, "required": false}}	2	2025-03-19 06:03:45.306	2025-03-19 10:51:18.357	#E3F2FD	AccountBalance
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: mojtabahassani
--

COPY public.requests (id, "requestTypeId", title, description, amount, "effectiveDate", "beneficiaryName", "beneficiaryPhone", "contactId", "groupId", status, "creatorId", "assigneeId", "createdAt", "updatedAt", "subGroupId") FROM stdin;
\.


--
-- Name: ContactPortalActivity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."ContactPortalActivity_id_seq"', 1, false);


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 2, true);


--
-- Name: GroupMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."GroupMember_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- Name: PaymentImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."PaymentImage_id_seq"', 1, false);


--
-- Name: PaymentRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."PaymentRequest_id_seq"', 6, true);


--
-- Name: Setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."Setting_id_seq"', 1, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public."User_id_seq"', 4, true);


--
-- Name: payment_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.payment_groups_id_seq', 1, false);


--
-- Name: request_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.request_activities_id_seq', 1, false);


--
-- Name: request_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.request_attachments_id_seq', 1, false);


--
-- Name: request_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.request_groups_id_seq', 3, true);


--
-- Name: request_sub_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.request_sub_groups_id_seq', 1, false);


--
-- Name: request_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.request_types_id_seq', 9, true);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mojtabahassani
--

SELECT pg_catalog.setval('public.requests_id_seq', 1, false);


--
-- Name: ContactPortalActivity ContactPortalActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."ContactPortalActivity"
    ADD CONSTRAINT "ContactPortalActivity_pkey" PRIMARY KEY (id);


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: GroupMember GroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PaymentImage PaymentImage_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentImage"
    ADD CONSTRAINT "PaymentImage_pkey" PRIMARY KEY (id);


--
-- Name: PaymentRequest PaymentRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: payment_groups payment_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.payment_groups
    ADD CONSTRAINT payment_groups_pkey PRIMARY KEY (id);


--
-- Name: request_activities request_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_activities
    ADD CONSTRAINT request_activities_pkey PRIMARY KEY (id);


--
-- Name: request_attachments request_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_attachments
    ADD CONSTRAINT request_attachments_pkey PRIMARY KEY (id);


--
-- Name: request_groups request_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_groups
    ADD CONSTRAINT request_groups_pkey PRIMARY KEY (id);


--
-- Name: request_sub_groups request_sub_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_sub_groups
    ADD CONSTRAINT request_sub_groups_pkey PRIMARY KEY (id);


--
-- Name: request_types request_types_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_types
    ADD CONSTRAINT request_types_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: Contact_accessToken_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX "Contact_accessToken_key" ON public."Contact" USING btree ("accessToken");


--
-- Name: GroupMember_groupId_userId_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON public."GroupMember" USING btree ("groupId", "userId");


--
-- Name: Setting_category_key_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX "Setting_category_key_key" ON public."Setting" USING btree (category, key);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: request_types_name_key; Type: INDEX; Schema: public; Owner: mojtabahassani
--

CREATE UNIQUE INDEX request_types_name_key ON public.request_types USING btree (name);


--
-- Name: ContactPortalActivity ContactPortalActivity_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."ContactPortalActivity"
    ADD CONSTRAINT "ContactPortalActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactPortalActivity ContactPortalActivity_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."ContactPortalActivity"
    ADD CONSTRAINT "ContactPortalActivity_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."PaymentRequest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Contact Contact_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupMember GroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.payment_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupMember GroupMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."PaymentRequest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentImage PaymentImage_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentImage"
    ADD CONSTRAINT "PaymentImage_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."PaymentRequest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentImage PaymentImage_uploaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentImage"
    ADD CONSTRAINT "PaymentImage_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentRequest PaymentRequest_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentRequest PaymentRequest_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentRequest PaymentRequest_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.payment_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentRequest PaymentRequest_paidById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentRequest PaymentRequest_updaterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_updaterId_fkey" FOREIGN KEY ("updaterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment_groups payment_groups_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.payment_groups
    ADD CONSTRAINT "payment_groups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_activities request_activities_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_activities
    ADD CONSTRAINT "request_activities_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: request_activities request_activities_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_activities
    ADD CONSTRAINT "request_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_attachments request_attachments_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_attachments
    ADD CONSTRAINT "request_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: request_attachments request_attachments_uploadedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_attachments
    ADD CONSTRAINT "request_attachments_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_groups request_groups_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_groups
    ADD CONSTRAINT "request_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_groups request_groups_requestTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_groups
    ADD CONSTRAINT "request_groups_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES public.request_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_sub_groups request_sub_groups_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_sub_groups
    ADD CONSTRAINT "request_sub_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_sub_groups request_sub_groups_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_sub_groups
    ADD CONSTRAINT "request_sub_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.request_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_types request_types_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.request_types
    ADD CONSTRAINT "request_types_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: requests requests_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: requests requests_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: requests requests_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: requests requests_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.request_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: requests requests_requestTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES public.request_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: requests requests_subGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mojtabahassani
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_subGroupId_fkey" FOREIGN KEY ("subGroupId") REFERENCES public.request_sub_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


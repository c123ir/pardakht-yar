--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.12

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
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'PAID',
    'REJECTED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'FINANCIAL_MANAGER',
    'ACCOUNTANT',
    'SELLER',
    'CEO',
    'PROCUREMENT',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Contact; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Contact" OWNER TO postgres;

--
-- Name: ContactPortalActivity; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."ContactPortalActivity" OWNER TO postgres;

--
-- Name: ContactPortalActivity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ContactPortalActivity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ContactPortalActivity_id_seq" OWNER TO postgres;

--
-- Name: ContactPortalActivity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ContactPortalActivity_id_seq" OWNED BY public."ContactPortalActivity".id;


--
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Contact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contact_id_seq" OWNER TO postgres;

--
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- Name: GroupMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupMember" (
    id integer NOT NULL,
    "groupId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GroupMember" OWNER TO postgres;

--
-- Name: GroupMember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GroupMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."GroupMember_id_seq" OWNER TO postgres;

--
-- Name: GroupMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GroupMember_id_seq" OWNED BY public."GroupMember".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: PaymentImage; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."PaymentImage" OWNER TO postgres;

--
-- Name: PaymentImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PaymentImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PaymentImage_id_seq" OWNER TO postgres;

--
-- Name: PaymentImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PaymentImage_id_seq" OWNED BY public."PaymentImage".id;


--
-- Name: PaymentRequest; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."PaymentRequest" OWNER TO postgres;

--
-- Name: PaymentRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PaymentRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PaymentRequest_id_seq" OWNER TO postgres;

--
-- Name: PaymentRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PaymentRequest_id_seq" OWNED BY public."PaymentRequest".id;


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Setting" (
    id integer NOT NULL,
    category text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Setting" OWNER TO postgres;

--
-- Name: Setting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Setting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Setting_id_seq" OWNER TO postgres;

--
-- Name: Setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Setting_id_seq" OWNED BY public."Setting".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    avatar text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: payment_groups; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.payment_groups OWNER TO postgres;

--
-- Name: payment_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_groups_id_seq OWNER TO postgres;

--
-- Name: payment_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_groups_id_seq OWNED BY public.payment_groups.id;


--
-- Name: request_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_activities (
    id integer NOT NULL,
    "requestId" integer NOT NULL,
    "userId" integer NOT NULL,
    action text NOT NULL,
    details jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.request_activities OWNER TO postgres;

--
-- Name: request_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_activities_id_seq OWNER TO postgres;

--
-- Name: request_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_activities_id_seq OWNED BY public.request_activities.id;


--
-- Name: request_attachments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.request_attachments OWNER TO postgres;

--
-- Name: request_attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_attachments_id_seq OWNER TO postgres;

--
-- Name: request_attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_attachments_id_seq OWNED BY public.request_attachments.id;


--
-- Name: request_groups; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.request_groups OWNER TO postgres;

--
-- Name: request_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_groups_id_seq OWNER TO postgres;

--
-- Name: request_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_groups_id_seq OWNED BY public.request_groups.id;


--
-- Name: request_sub_groups; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.request_sub_groups OWNER TO postgres;

--
-- Name: request_sub_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_sub_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_sub_groups_id_seq OWNER TO postgres;

--
-- Name: request_sub_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_sub_groups_id_seq OWNED BY public.request_sub_groups.id;


--
-- Name: request_types; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.request_types OWNER TO postgres;

--
-- Name: request_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_types_id_seq OWNER TO postgres;

--
-- Name: request_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_types_id_seq OWNED BY public.request_types.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requests_id_seq OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- Name: ContactPortalActivity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactPortalActivity" ALTER COLUMN id SET DEFAULT nextval('public."ContactPortalActivity_id_seq"'::regclass);


--
-- Name: GroupMember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember" ALTER COLUMN id SET DEFAULT nextval('public."GroupMember_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: PaymentImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentImage" ALTER COLUMN id SET DEFAULT nextval('public."PaymentImage_id_seq"'::regclass);


--
-- Name: PaymentRequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest" ALTER COLUMN id SET DEFAULT nextval('public."PaymentRequest_id_seq"'::regclass);


--
-- Name: Setting id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Setting" ALTER COLUMN id SET DEFAULT nextval('public."Setting_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: payment_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_groups ALTER COLUMN id SET DEFAULT nextval('public.payment_groups_id_seq'::regclass);


--
-- Name: request_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_activities ALTER COLUMN id SET DEFAULT nextval('public.request_activities_id_seq'::regclass);


--
-- Name: request_attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_attachments ALTER COLUMN id SET DEFAULT nextval('public.request_attachments_id_seq'::regclass);


--
-- Name: request_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_groups ALTER COLUMN id SET DEFAULT nextval('public.request_groups_id_seq'::regclass);


--
-- Name: request_sub_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_sub_groups ALTER COLUMN id SET DEFAULT nextval('public.request_sub_groups_id_seq'::regclass);


--
-- Name: request_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_types ALTER COLUMN id SET DEFAULT nextval('public.request_types_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Contact" (id, "companyName", "contactPerson", phone, email, address, "nationalId", "economicCode", description, "bankInfo", "accessToken", "ceoName", "accountantName", "accountantPhone", "creatorId", "createdAt", "updatedAt", "fieldOfActivity") FROM stdin;
\.


--
-- Data for Name: ContactPortalActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactPortalActivity" (id, "contactId", "paymentId", action, "ipAddress", "userAgent", feedback, "createdAt") FROM stdin;
\.


--
-- Data for Name: GroupMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupMember" (id, "groupId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "paymentId", "recipientType", "recipientId", message, method, status, "sentAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: PaymentImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentImage" (id, "paymentId", "fileName", "filePath", "thumbnailPath", "originalName", "mimeType", size, "hasWatermark", "uploaderId", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: PaymentRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentRequest" (id, title, amount, "effectiveDate", description, status, "paymentType", "groupId", "contactId", "beneficiaryName", "beneficiaryPhone", "isSMSSent", "smsSentAt", "paymentDate", "paidById", "creatorId", "updaterId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Setting" (id, category, key, value, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password, "fullName", email, phone, role, "isActive", "lastLogin", "createdAt", "updatedAt", avatar) FROM stdin;
1	admin	$2b$10$Fmk7H33CH5jtT8bTyhf4juPjf1iNyFO/7gWIzwofQByvHuwmvr.q2	مدیر سیستم داکر	admin@example.com	\N	ADMIN	t	2025-03-22 00:09:54.049	2025-03-22 00:05:30.858	2025-03-22 00:10:11.136	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e8436293-9db0-4756-a7ca-ddd5dce4a8dc	51a3151a1c49cc09121fd3219ca1d9cc69f618362f64b8ddd2da9fad36e4da36	2025-03-22 00:05:20.590329+00	20250318123245_init	\N	\N	2025-03-22 00:05:20.512805+00	1
343cf54f-0b5f-416f-bf56-6a35d37b6e71	5ea9761cb4712608ce1d396b60d299b837163b33dd789033382ec0d077fd8e64	2025-03-22 00:05:20.605181+00	20250318150358_add_mobile_verification	\N	\N	2025-03-22 00:05:20.592463+00	1
a2b5d66b-5715-49cd-8492-ac89d6f667de	04740207ef2bbf80510d5cc91505c7103105cfcabdc75600fd48b11612c63435	2025-03-22 00:05:20.621719+00	20250318154906_add_contact_model	\N	\N	2025-03-22 00:05:20.60762+00	1
907ba44d-38e7-4de7-8151-6fa546db176d	ac70dae91795f6b54b1d0e4dd5455ec7b2e823afabeac6ffd74ade03fa0c5693	2025-03-22 00:05:20.682442+00	20250319045357_add_request_models	\N	\N	2025-03-22 00:05:20.62371+00	1
178c263c-f68f-4b0f-bd85-64dabdfb49e7	a127a1302b05b14fb8d80f9fed1b9fc29dc914f715a0e6e24a51ba7a0c451180	2025-03-22 00:05:20.710306+00	20250319051309_add_contact_fields	\N	\N	2025-03-22 00:05:20.683718+00	1
5dd10c3d-1eea-4611-b80a-898a53563dfd	d73051404be6e843a95636331bc933e1dee8e4cdfe8efdd27356bd1a9cc145c2	2025-03-22 00:05:20.71513+00	20250319051346_add_field_of_activity	\N	\N	2025-03-22 00:05:20.71185+00	1
2b88501c-a7cd-4f69-8fa4-de152ae68326	3b8627a36103dfe5917fbb34d5351bc91d430f88fe9c3bc11c5b0c7d6ffbd2a3	2025-03-22 00:05:20.758691+00	20250319062435_add_request_groups	\N	\N	2025-03-22 00:05:20.716448+00	1
c631bdb7-81bd-4bec-b9c7-b50d98a95880	28482ed9cc40a636cff3dde4ac4713e2a7a33c36eab03e78d1bd1c0d4ccbdec7	2025-03-22 00:05:20.766464+00	20250319101932_add_icon_and_color_to_request_type	\N	\N	2025-03-22 00:05:20.761084+00	1
bf3afd01-a42e-40e6-85bf-c60f16abc1df	1527e28ca6984eb4164a536b0298dbb1a295e558cb4ddfc86bc436e7367d8696	2025-03-22 00:05:20.775007+00	20250321133122_	\N	\N	2025-03-22 00:05:20.768107+00	1
005790be-738c-4e7f-9e30-cc47eb312785	1da24e0ef135b3d4cac0e99f807823b6ed96c595f177d65df75d3e090d2862ac	2025-03-22 00:05:20.782564+00	20250321165204_add_user_role	\N	\N	2025-03-22 00:05:20.777411+00	1
\.


--
-- Data for Name: payment_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_groups (id, title, description, color, "creatorId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: request_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_activities (id, "requestId", "userId", action, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: request_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_attachments (id, "requestId", "filePath", "fileType", "fileName", "uploadedBy", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: request_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_groups (id, name, description, "requestTypeId", "isActive", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: request_sub_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_sub_groups (id, name, description, "groupId", "isActive", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: request_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.request_types (id, name, description, "isActive", "fieldConfig", "createdBy", "createdAt", "updatedAt", color, "iconName") FROM stdin;
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, "requestTypeId", title, description, amount, "effectiveDate", "beneficiaryName", "beneficiaryPhone", "contactId", "groupId", status, "creatorId", "assigneeId", "createdAt", "updatedAt", "subGroupId") FROM stdin;
\.


--
-- Name: ContactPortalActivity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ContactPortalActivity_id_seq"', 1, false);


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 1, false);


--
-- Name: GroupMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GroupMember_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- Name: PaymentImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PaymentImage_id_seq"', 1, false);


--
-- Name: PaymentRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PaymentRequest_id_seq"', 1, false);


--
-- Name: Setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Setting_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: payment_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_groups_id_seq', 1, false);


--
-- Name: request_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_activities_id_seq', 1, false);


--
-- Name: request_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_attachments_id_seq', 1, false);


--
-- Name: request_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_groups_id_seq', 1, false);


--
-- Name: request_sub_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_sub_groups_id_seq', 1, false);


--
-- Name: request_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_types_id_seq', 1, false);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 1, false);


--
-- Name: ContactPortalActivity ContactPortalActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactPortalActivity"
    ADD CONSTRAINT "ContactPortalActivity_pkey" PRIMARY KEY (id);


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: GroupMember GroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PaymentImage PaymentImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentImage"
    ADD CONSTRAINT "PaymentImage_pkey" PRIMARY KEY (id);


--
-- Name: PaymentRequest PaymentRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: payment_groups payment_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_groups
    ADD CONSTRAINT payment_groups_pkey PRIMARY KEY (id);


--
-- Name: request_activities request_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_activities
    ADD CONSTRAINT request_activities_pkey PRIMARY KEY (id);


--
-- Name: request_attachments request_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_attachments
    ADD CONSTRAINT request_attachments_pkey PRIMARY KEY (id);


--
-- Name: request_groups request_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_groups
    ADD CONSTRAINT request_groups_pkey PRIMARY KEY (id);


--
-- Name: request_sub_groups request_sub_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_sub_groups
    ADD CONSTRAINT request_sub_groups_pkey PRIMARY KEY (id);


--
-- Name: request_types request_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_types
    ADD CONSTRAINT request_types_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: Contact_accessToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Contact_accessToken_key" ON public."Contact" USING btree ("accessToken");


--
-- Name: GroupMember_groupId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON public."GroupMember" USING btree ("groupId", "userId");


--
-- Name: Setting_category_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Setting_category_key_key" ON public."Setting" USING btree (category, key);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: request_types_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX request_types_name_key ON public.request_types USING btree (name);


--
-- Name: ContactPortalActivity ContactPortalActivity_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactPortalActivity"
    ADD CONSTRAINT "ContactPortalActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactPortalActivity ContactPortalActivity_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactPortalActivity"
    ADD CONSTRAINT "ContactPortalActivity_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."PaymentRequest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Contact Contact_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupMember GroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.payment_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GroupMember GroupMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupMember"
    ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."PaymentRequest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentImage PaymentImage_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentImage"
    ADD CONSTRAINT "PaymentImage_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."PaymentRequest"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentImage PaymentImage_uploaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentImage"
    ADD CONSTRAINT "PaymentImage_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentRequest PaymentRequest_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentRequest PaymentRequest_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentRequest PaymentRequest_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.payment_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentRequest PaymentRequest_paidById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaymentRequest PaymentRequest_updaterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentRequest"
    ADD CONSTRAINT "PaymentRequest_updaterId_fkey" FOREIGN KEY ("updaterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment_groups payment_groups_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_groups
    ADD CONSTRAINT "payment_groups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_activities request_activities_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_activities
    ADD CONSTRAINT "request_activities_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: request_activities request_activities_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_activities
    ADD CONSTRAINT "request_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_attachments request_attachments_requestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_attachments
    ADD CONSTRAINT "request_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES public.requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: request_attachments request_attachments_uploadedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_attachments
    ADD CONSTRAINT "request_attachments_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_groups request_groups_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_groups
    ADD CONSTRAINT "request_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_groups request_groups_requestTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_groups
    ADD CONSTRAINT "request_groups_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES public.request_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_sub_groups request_sub_groups_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_sub_groups
    ADD CONSTRAINT "request_sub_groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_sub_groups request_sub_groups_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_sub_groups
    ADD CONSTRAINT "request_sub_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.request_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: request_types request_types_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_types
    ADD CONSTRAINT "request_types_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: requests requests_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: requests requests_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: requests requests_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: requests requests_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.request_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: requests requests_requestTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES public.request_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: requests requests_subGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "requests_subGroupId_fkey" FOREIGN KEY ("subGroupId") REFERENCES public.request_sub_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


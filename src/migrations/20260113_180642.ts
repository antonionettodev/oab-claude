import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_newsletter_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_board_position" AS ENUM('presidente', 'vice-presidente', 'secretario-geral', 'secretario-geral-adjunto', 'tesoureiro', 'tesoureiro-adjunto', 'diretor-administrativo', 'diretor-executivo', 'diretor-relacoes-institucionais', 'diretor-defesa-prerrogativas-valorizacao-advocacia', 'diretor-educacao-juridica', 'diretor-iniciacao-profissional', 'diretor-tecnologia-inovacao', 'diretor-inclusao-acessibilidade', 'diretor-interiorizacao', 'diretor-assuntos-penais', 'diretor-atendimento', 'diretor-relacionamento-justica-federal', 'diretor-relacionamento-justica-estadual', 'diretor-relacionamento-justica-trabalho', 'diretor-relacionamento-justica-eleitoral', 'conselho-estadual-titular', 'conselho-estadual-suplente', 'conselho-federal-titular', 'conselho-federal-suplente');
  CREATE TYPE "public"."enum_counselors_council_type" AS ENUM('estadual', 'federal');
  CREATE TYPE "public"."enum_counselors_position_type" AS ENUM('titular', 'suplente');
  CREATE TYPE "public"."enum_members_adjudicating_chamber_position" AS ENUM('presidente', 'vice-presidente', 'relator', 'relatora');
  CREATE TYPE "public"."enum_ted_members_position" AS ENUM('presidente', 'vice-presidente', 'secretario-geral', 'secretaria-geral');
  CREATE TYPE "public"."enum_ted_members_member_type" AS ENUM('titular', 'suplente');
  CREATE TYPE "public"."enum_commissions_type" AS ENUM('permanente', 'temporaria');
  CREATE TYPE "public"."enum_commission_members_position" AS ENUM('presidente', 'vice-presidente', 'secretario', 'secretario-adjunto', 'membro', 'membro-consultivo');
  CREATE TYPE "public"."enum_subsection_members_position" AS ENUM('presidente', 'vice-presidente', 'secretario-geral', 'secretario-geral-adjunto', 'tesoureiro', 'conselheiro');
  CREATE TYPE "public"."enum_events_type" AS ENUM('event', 'course', 'conference', 'workshop', 'seminar', 'lecture');
  CREATE TYPE "public"."enum_events_event_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_events_modality" AS ENUM('in-person', 'hybrid', 'virtual');
  CREATE TYPE "public"."enum_events_streaming_platform" AS ENUM('youtube', 'zoom', 'teams', 'meet', 'other');
  CREATE TYPE "public"."enum_events_registration_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published', 'registration-open', 'registration-closed', 'ongoing', 'closed', 'cancelled');
  CREATE TYPE "public"."enum_registrations_tickets_ticket_status" AS ENUM('active', 'checked-in', 'attended', 'absent', 'transferred', 'cancelled');
  CREATE TYPE "public"."enum_registrations_payment_status" AS ENUM('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled', 'complimentary');
  CREATE TYPE "public"."enum_registrations_payment_method" AS ENUM('boleto', 'credit-card', 'debit-card', 'pix', 'transfer', 'complimentary');
  CREATE TYPE "public"."enum_registrations_status" AS ENUM('pending', 'confirmed', 'partial-checkin', 'checked-in', 'attended', 'absent', 'cancelled');
  CREATE TYPE "public"."enum_certificates_status" AS ENUM('pending', 'generated', 'sent', 'error', 'revoked');
  CREATE TYPE "public"."enum_checkins_checkin_type" AS ENUM('manual', 'automatic', 'qr-individual');
  CREATE TYPE "public"."enum_checkins_checkin_method" AS ENUM('qr-code', 'token', 'manual-search', 'list');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'sendPostNotification', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'sendPostNotification', 'schedulePublish');
  CREATE TYPE "public"."enum_file_folders_folder_type" AS ENUM('files');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" jsonb,
  	"is_public" boolean DEFAULT true,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"highlight" boolean DEFAULT false,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"content" jsonb,
  	"commission_id" integer,
  	"subsection_id" integer,
  	"highlight" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"notification_sent" boolean DEFAULT false,
  	"reading_time" numeric,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"users_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_featured_image_id" integer,
  	"version_content" jsonb,
  	"version_commission_id" integer,
  	"version_subsection_id" integer,
  	"version_highlight" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_notification_sent" boolean DEFAULT false,
  	"version_reading_time" numeric,
  	"version_edited_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"users_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "newsletter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"status" "enum_newsletter_status" DEFAULT 'active',
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "managements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"management_start" numeric NOT NULL,
  	"management_end" numeric NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "board" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"oab_number" varchar NOT NULL,
  	"photo_id" integer,
  	"management_id" integer NOT NULL,
  	"position" "enum_board_position" NOT NULL,
  	"biography" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "counselors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"oab_number" varchar NOT NULL,
  	"management_id" integer NOT NULL,
  	"council_type" "enum_counselors_council_type" NOT NULL,
  	"position_type" "enum_counselors_position_type" NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "state_council_digests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"process_number" varchar NOT NULL,
  	"acordao_number" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"information" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "adjudicating_chamber" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "members_adjudicating_chamber" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"oab_number" varchar NOT NULL,
  	"adjudicating_chamber_id" integer NOT NULL,
  	"position" "enum_members_adjudicating_chamber_position" NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ted_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"oab_number" varchar NOT NULL,
  	"position" "enum_ted_members_position",
  	"is_turma_composition" boolean DEFAULT false,
  	"composition_id" integer NOT NULL,
  	"location" varchar,
  	"member_type" "enum_ted_members_member_type",
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "composition" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ted_council_digests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"process_number" varchar NOT NULL,
  	"acordao_number" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"information" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legislations_ted" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type_id" integer NOT NULL,
  	"file_id" integer NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legislations_ted_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "calendar_ted" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"location" varchar NOT NULL,
  	"description" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "commissions_focus_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "commissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_commissions_type" DEFAULT 'permanente' NOT NULL,
  	"area_id" integer,
  	"subsection_id" integer,
  	"about" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "commission_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"oab_number" varchar,
  	"image_id" integer,
  	"commission_id" integer NOT NULL,
  	"position" "enum_commission_members_position" NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "commission_areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subsections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"region_id" integer NOT NULL,
  	"creation_date" timestamp(3) with time zone,
  	"about" varchar,
  	"mission" varchar,
  	"street" varchar,
  	"district" varchar,
  	"city" varchar,
  	"postal_code" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"service_hours" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subsection_regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subsection_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"oab_number" varchar,
  	"image_id" integer,
  	"subsection_id" integer NOT NULL,
  	"position" "enum_subsection_members_position" NOT NULL,
  	"management_id" integer NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subsection_rooms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subsection_id" integer NOT NULL,
  	"address" varchar NOT NULL,
  	"service_hours" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "urh_honorarium" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"file_id" integer NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legislations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type_id" integer NOT NULL,
  	"file_id" integer NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "legislations_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lawyers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "lawyers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"oab_number" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "events_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"requirement" varchar NOT NULL
  );
  
  CREATE TABLE "events_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "events_rooms_room_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"speaker_id" integer,
  	"session_description" varchar
  );
  
  CREATE TABLE "events_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"capacity" numeric NOT NULL,
  	"floor" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "events_program" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"time" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"brief_description" varchar,
  	"speaker_id" integer
  );
  
  CREATE TABLE "events_ticket_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"participant_category_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"max_quantity" numeric,
  	"is_active" boolean DEFAULT true,
  	"description" varchar,
  	"early_bird_price" numeric,
  	"early_bird_deadline" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_group_discount_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min_quantity" numeric,
  	"max_quantity" numeric,
  	"discount_percent" numeric
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_events_type" DEFAULT 'event' NOT NULL,
  	"event_type" "enum_events_event_type" DEFAULT 'internal' NOT NULL,
  	"modality" "enum_events_modality" DEFAULT 'in-person' NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"commission_id" integer,
  	"subsection_id" integer,
  	"venue" varchar,
  	"address" varchar,
  	"city" varchar,
  	"streaming_url" varchar,
  	"streaming_platform" "enum_events_streaming_platform",
  	"description" varchar NOT NULL,
  	"short_description" varchar,
  	"target_audience" varchar,
  	"workload" numeric,
  	"featured_image_id" integer NOT NULL,
  	"has_multiple_rooms" boolean DEFAULT false,
  	"registration_type" "enum_events_registration_type" DEFAULT 'internal' NOT NULL,
  	"registration_limit" numeric,
  	"external_registration_url" varchar,
  	"allow_multiple_tickets" boolean DEFAULT true,
  	"require_ticket_holder_data" boolean DEFAULT true,
  	"registration_start_date" timestamp(3) with time zone,
  	"registration_end_date" timestamp(3) with time zone,
  	"refund_deadline_days" numeric DEFAULT 7,
  	"group_discount_enabled" boolean DEFAULT false,
  	"group_discount_description" varchar,
  	"checkin_password" varchar,
  	"event_q_r_code" varchar,
  	"checkin_start_minutes" numeric DEFAULT 60,
  	"has_certificate" boolean DEFAULT false,
  	"certificate_template_id" integer,
  	"certificate_title" varchar,
  	"certificate_description" varchar,
  	"minimum_attendance_percent" numeric DEFAULT 75,
  	"allow_duplicate_certificate" boolean DEFAULT true,
  	"status" "enum_events_status" DEFAULT 'draft' NOT NULL,
  	"is_featured" boolean DEFAULT false,
  	"registration_count" numeric DEFAULT 0,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"speakers_id" integer
  );
  
  CREATE TABLE "speakers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"professional_title" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"bio" varchar,
  	"short_bio" varchar,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"lattes" varchar,
  	"website" varchar,
  	"is_active" boolean DEFAULT true,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "registrations_tickets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"participant_name" varchar NOT NULL,
  	"participant_c_p_f" varchar NOT NULL,
  	"participant_o_a_b" varchar,
  	"participant_email" varchar NOT NULL,
  	"participant_phone" varchar,
  	"ticket_type_id" integer NOT NULL,
  	"unit_price" numeric,
  	"ticket_status" "enum_registrations_tickets_ticket_status" DEFAULT 'active',
  	"token" varchar,
  	"qr_code" varchar,
  	"checkin_at" timestamp(3) with time zone,
  	"checkin_by_id" integer
  );
  
  CREATE TABLE "registrations_room_selections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"room_id" varchar,
  	"room_name" varchar,
  	"date" timestamp(3) with time zone,
  	"start_time" varchar,
  	"end_time" varchar,
  	"activity_title" varchar
  );
  
  CREATE TABLE "registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registration_code" varchar,
  	"event_id" integer NOT NULL,
  	"registrant_name" varchar NOT NULL,
  	"registrant_c_p_f" varchar NOT NULL,
  	"registrant_o_a_b" varchar,
  	"registrant_email" varchar NOT NULL,
  	"registrant_phone" varchar NOT NULL,
  	"user_id" integer,
  	"subtotal" numeric,
  	"discount_percent" numeric,
  	"discount_amount" numeric,
  	"total_price" numeric,
  	"group_discount_applied" boolean,
  	"payment_status" "enum_registrations_payment_status" DEFAULT 'pending' NOT NULL,
  	"payment_method" "enum_registrations_payment_method",
  	"payment_date" timestamp(3) with time zone,
  	"payment_reference" varchar,
  	"notes" varchar,
  	"admin_notes" varchar,
  	"status" "enum_registrations_status" DEFAULT 'pending' NOT NULL,
  	"registration_date" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"certificate_number" varchar,
  	"validation_hash" varchar,
  	"registration_id" integer NOT NULL,
  	"event_id" integer,
  	"ticket_index" numeric DEFAULT 0,
  	"participant_name" varchar,
  	"participant_c_p_f" varchar,
  	"participant_email" varchar,
  	"event_title" varchar,
  	"event_start_date" timestamp(3) with time zone,
  	"event_end_date" timestamp(3) with time zone,
  	"workload" numeric,
  	"issued_at" timestamp(3) with time zone,
  	"is_duplicate" boolean DEFAULT false,
  	"download_count" numeric DEFAULT 0,
  	"original_certificate_id_id" integer,
  	"validation_q_r_code" varchar,
  	"certificate_data" varchar,
  	"pdf_file_id" integer,
  	"last_download_at" timestamp(3) with time zone,
  	"status" "enum_certificates_status" DEFAULT 'pending',
  	"error_message" varchar,
  	"sent_at" timestamp(3) with time zone,
  	"revoked_at" timestamp(3) with time zone,
  	"revoked_reason" varchar,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "participant_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"description" varchar,
  	"requires_o_a_b" boolean DEFAULT false,
  	"requires_c_p_f" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"color" varchar,
  	"created_by_id" integer,
  	"edited_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "checkins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"registration_id" integer NOT NULL,
  	"event_id" integer,
  	"participant_name" varchar,
  	"event_title" varchar,
  	"ticket_index" numeric DEFAULT 0,
  	"checkin_type" "enum_checkins_checkin_type" NOT NULL,
  	"checkin_method" "enum_checkins_checkin_method",
  	"checkin_at" timestamp(3) with time zone NOT NULL,
  	"is_valid" boolean DEFAULT true,
  	"voucher_validated" boolean DEFAULT false,
  	"payment_validated" boolean DEFAULT false,
  	"presence_confirmed" boolean DEFAULT false,
  	"qr_code_data" varchar,
  	"token_validated" boolean DEFAULT false,
  	"ticket_generated" boolean DEFAULT false,
  	"ticket_q_r_code" varchar,
  	"ticket_printed_at" timestamp(3) with time zone,
  	"room_id" varchar,
  	"room_name" varchar,
  	"session_time" varchar,
  	"notes" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"device_info" varchar,
  	"checkin_by_id" integer,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_id" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author_id" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"excerpt" varchar,
  	"featured_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "file_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_file_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "file_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"files_id" integer,
  	"categories_id" integer,
  	"posts_id" integer,
  	"newsletter_id" integer,
  	"managements_id" integer,
  	"board_id" integer,
  	"counselors_id" integer,
  	"state_council_digests_id" integer,
  	"adjudicating_chamber_id" integer,
  	"members_adjudicating_chamber_id" integer,
  	"ted_members_id" integer,
  	"composition_id" integer,
  	"ted_council_digests_id" integer,
  	"legislations_ted_id" integer,
  	"legislations_ted_types_id" integer,
  	"calendar_ted_id" integer,
  	"commissions_id" integer,
  	"commission_members_id" integer,
  	"commission_areas_id" integer,
  	"subsections_id" integer,
  	"subsection_regions_id" integer,
  	"subsection_members_id" integer,
  	"subsection_rooms_id" integer,
  	"urh_honorarium_id" integer,
  	"legislations_id" integer,
  	"legislations_types_id" integer,
  	"lawyers_id" integer,
  	"events_id" integer,
  	"speakers_id" integer,
  	"registrations_id" integer,
  	"certificates_id" integer,
  	"participant_categories_id" integer,
  	"checkins_id" integer,
  	"search_id" integer,
  	"redirects_id" integer,
  	"file_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"lawyers_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "files" ADD CONSTRAINT "files_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "files" ADD CONSTRAINT "files_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "files" ADD CONSTRAINT "files_folder_id_file_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."file_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_files_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_commission_id_commissions_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_subsection_id_subsections_id_fk" FOREIGN KEY ("subsection_id") REFERENCES "public"."subsections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_files_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_files_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_commission_id_commissions_id_fk" FOREIGN KEY ("version_commission_id") REFERENCES "public"."commissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_subsection_id_subsections_id_fk" FOREIGN KEY ("version_subsection_id") REFERENCES "public"."subsections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_files_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_edited_by_id_users_id_fk" FOREIGN KEY ("version_edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletter" ADD CONSTRAINT "newsletter_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "managements" ADD CONSTRAINT "managements_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "managements" ADD CONSTRAINT "managements_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board" ADD CONSTRAINT "board_photo_id_files_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board" ADD CONSTRAINT "board_management_id_managements_id_fk" FOREIGN KEY ("management_id") REFERENCES "public"."managements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board" ADD CONSTRAINT "board_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board" ADD CONSTRAINT "board_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "counselors" ADD CONSTRAINT "counselors_management_id_managements_id_fk" FOREIGN KEY ("management_id") REFERENCES "public"."managements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "counselors" ADD CONSTRAINT "counselors_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "counselors" ADD CONSTRAINT "counselors_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "state_council_digests" ADD CONSTRAINT "state_council_digests_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "state_council_digests" ADD CONSTRAINT "state_council_digests_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "adjudicating_chamber" ADD CONSTRAINT "adjudicating_chamber_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "adjudicating_chamber" ADD CONSTRAINT "adjudicating_chamber_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "members_adjudicating_chamber" ADD CONSTRAINT "members_adjudicating_chamber_adjudicating_chamber_id_adjudicating_chamber_id_fk" FOREIGN KEY ("adjudicating_chamber_id") REFERENCES "public"."adjudicating_chamber"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "members_adjudicating_chamber" ADD CONSTRAINT "members_adjudicating_chamber_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "members_adjudicating_chamber" ADD CONSTRAINT "members_adjudicating_chamber_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ted_members" ADD CONSTRAINT "ted_members_composition_id_composition_id_fk" FOREIGN KEY ("composition_id") REFERENCES "public"."composition"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ted_members" ADD CONSTRAINT "ted_members_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ted_members" ADD CONSTRAINT "ted_members_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "composition" ADD CONSTRAINT "composition_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "composition" ADD CONSTRAINT "composition_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ted_council_digests" ADD CONSTRAINT "ted_council_digests_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ted_council_digests" ADD CONSTRAINT "ted_council_digests_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_ted" ADD CONSTRAINT "legislations_ted_type_id_legislations_ted_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."legislations_ted_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_ted" ADD CONSTRAINT "legislations_ted_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_ted" ADD CONSTRAINT "legislations_ted_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_ted" ADD CONSTRAINT "legislations_ted_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_ted_types" ADD CONSTRAINT "legislations_ted_types_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_ted_types" ADD CONSTRAINT "legislations_ted_types_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calendar_ted" ADD CONSTRAINT "calendar_ted_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calendar_ted" ADD CONSTRAINT "calendar_ted_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commissions_focus_areas" ADD CONSTRAINT "commissions_focus_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commissions" ADD CONSTRAINT "commissions_area_id_commission_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."commission_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commissions" ADD CONSTRAINT "commissions_subsection_id_subsections_id_fk" FOREIGN KEY ("subsection_id") REFERENCES "public"."subsections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commissions" ADD CONSTRAINT "commissions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commissions" ADD CONSTRAINT "commissions_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_commission_id_commissions_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commission_members" ADD CONSTRAINT "commission_members_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commission_areas" ADD CONSTRAINT "commission_areas_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commission_areas" ADD CONSTRAINT "commission_areas_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsections" ADD CONSTRAINT "subsections_region_id_subsection_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."subsection_regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsections" ADD CONSTRAINT "subsections_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsections" ADD CONSTRAINT "subsections_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_regions" ADD CONSTRAINT "subsection_regions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_regions" ADD CONSTRAINT "subsection_regions_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_members" ADD CONSTRAINT "subsection_members_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_members" ADD CONSTRAINT "subsection_members_subsection_id_subsections_id_fk" FOREIGN KEY ("subsection_id") REFERENCES "public"."subsections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_members" ADD CONSTRAINT "subsection_members_management_id_managements_id_fk" FOREIGN KEY ("management_id") REFERENCES "public"."managements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_members" ADD CONSTRAINT "subsection_members_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_members" ADD CONSTRAINT "subsection_members_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_rooms" ADD CONSTRAINT "subsection_rooms_subsection_id_subsections_id_fk" FOREIGN KEY ("subsection_id") REFERENCES "public"."subsections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_rooms" ADD CONSTRAINT "subsection_rooms_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subsection_rooms" ADD CONSTRAINT "subsection_rooms_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "urh_honorarium" ADD CONSTRAINT "urh_honorarium_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "urh_honorarium" ADD CONSTRAINT "urh_honorarium_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "urh_honorarium" ADD CONSTRAINT "urh_honorarium_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations" ADD CONSTRAINT "legislations_type_id_legislations_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."legislations_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations" ADD CONSTRAINT "legislations_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations" ADD CONSTRAINT "legislations_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations" ADD CONSTRAINT "legislations_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_types" ADD CONSTRAINT "legislations_types_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legislations_types" ADD CONSTRAINT "legislations_types_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lawyers_sessions" ADD CONSTRAINT "lawyers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lawyers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_included" ADD CONSTRAINT "events_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_requirements" ADD CONSTRAINT "events_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rooms_room_schedule" ADD CONSTRAINT "events_rooms_room_schedule_speaker_id_speakers_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speakers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rooms_room_schedule" ADD CONSTRAINT "events_rooms_room_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rooms" ADD CONSTRAINT "events_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_program" ADD CONSTRAINT "events_program_speaker_id_speakers_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speakers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_program" ADD CONSTRAINT "events_program_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_ticket_types" ADD CONSTRAINT "events_ticket_types_participant_category_id_participant_categories_id_fk" FOREIGN KEY ("participant_category_id") REFERENCES "public"."participant_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_ticket_types" ADD CONSTRAINT "events_ticket_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_group_discount_tiers" ADD CONSTRAINT "events_group_discount_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_commission_id_commissions_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_subsection_id_subsections_id_fk" FOREIGN KEY ("subsection_id") REFERENCES "public"."subsections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_featured_image_id_files_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_certificate_template_id_files_id_fk" FOREIGN KEY ("certificate_template_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_photo_id_files_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations_tickets" ADD CONSTRAINT "registrations_tickets_ticket_type_id_participant_categories_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."participant_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations_tickets" ADD CONSTRAINT "registrations_tickets_checkin_by_id_users_id_fk" FOREIGN KEY ("checkin_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations_tickets" ADD CONSTRAINT "registrations_tickets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "registrations_room_selections" ADD CONSTRAINT "registrations_room_selections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_original_certificate_id_id_certificates_id_fk" FOREIGN KEY ("original_certificate_id_id") REFERENCES "public"."certificates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_pdf_file_id_files_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "participant_categories" ADD CONSTRAINT "participant_categories_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "participant_categories" ADD CONSTRAINT "participant_categories_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkins" ADD CONSTRAINT "checkins_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkins" ADD CONSTRAINT "checkins_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkins" ADD CONSTRAINT "checkins_checkin_by_id_users_id_fk" FOREIGN KEY ("checkin_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "checkins" ADD CONSTRAINT "checkins_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_populated_authors" ADD CONSTRAINT "search_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_featured_image_id_files_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_files_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "file_folders_folder_type" ADD CONSTRAINT "file_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."file_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "file_folders" ADD CONSTRAINT "file_folders_folder_id_file_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."file_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_managements_fk" FOREIGN KEY ("managements_id") REFERENCES "public"."managements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_board_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_counselors_fk" FOREIGN KEY ("counselors_id") REFERENCES "public"."counselors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_state_council_digests_fk" FOREIGN KEY ("state_council_digests_id") REFERENCES "public"."state_council_digests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_adjudicating_chamber_fk" FOREIGN KEY ("adjudicating_chamber_id") REFERENCES "public"."adjudicating_chamber"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_adjudicating_chambe_fk" FOREIGN KEY ("members_adjudicating_chamber_id") REFERENCES "public"."members_adjudicating_chamber"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ted_members_fk" FOREIGN KEY ("ted_members_id") REFERENCES "public"."ted_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_composition_fk" FOREIGN KEY ("composition_id") REFERENCES "public"."composition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ted_council_digests_fk" FOREIGN KEY ("ted_council_digests_id") REFERENCES "public"."ted_council_digests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legislations_ted_fk" FOREIGN KEY ("legislations_ted_id") REFERENCES "public"."legislations_ted"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legislations_ted_types_fk" FOREIGN KEY ("legislations_ted_types_id") REFERENCES "public"."legislations_ted_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calendar_ted_fk" FOREIGN KEY ("calendar_ted_id") REFERENCES "public"."calendar_ted"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commissions_fk" FOREIGN KEY ("commissions_id") REFERENCES "public"."commissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commission_members_fk" FOREIGN KEY ("commission_members_id") REFERENCES "public"."commission_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commission_areas_fk" FOREIGN KEY ("commission_areas_id") REFERENCES "public"."commission_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subsections_fk" FOREIGN KEY ("subsections_id") REFERENCES "public"."subsections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subsection_regions_fk" FOREIGN KEY ("subsection_regions_id") REFERENCES "public"."subsection_regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subsection_members_fk" FOREIGN KEY ("subsection_members_id") REFERENCES "public"."subsection_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subsection_rooms_fk" FOREIGN KEY ("subsection_rooms_id") REFERENCES "public"."subsection_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_urh_honorarium_fk" FOREIGN KEY ("urh_honorarium_id") REFERENCES "public"."urh_honorarium"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legislations_fk" FOREIGN KEY ("legislations_id") REFERENCES "public"."legislations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legislations_types_fk" FOREIGN KEY ("legislations_types_id") REFERENCES "public"."legislations_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lawyers_fk" FOREIGN KEY ("lawyers_id") REFERENCES "public"."lawyers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_participant_categories_fk" FOREIGN KEY ("participant_categories_id") REFERENCES "public"."participant_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_checkins_fk" FOREIGN KEY ("checkins_id") REFERENCES "public"."checkins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_file_folders_fk" FOREIGN KEY ("file_folders_id") REFERENCES "public"."file_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_lawyers_fk" FOREIGN KEY ("lawyers_id") REFERENCES "public"."lawyers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_created_by_idx" ON "users" USING btree ("created_by_id");
  CREATE INDEX "users_edited_by_idx" ON "users" USING btree ("edited_by_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "files_created_by_idx" ON "files" USING btree ("created_by_id");
  CREATE INDEX "files_edited_by_idx" ON "files" USING btree ("edited_by_id");
  CREATE INDEX "files_folder_idx" ON "files" USING btree ("folder_id");
  CREATE INDEX "files_updated_at_idx" ON "files" USING btree ("updated_at");
  CREATE INDEX "files_created_at_idx" ON "files" USING btree ("created_at");
  CREATE UNIQUE INDEX "files_filename_idx" ON "files" USING btree ("filename");
  CREATE INDEX "files_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "files" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "files_sizes_square_sizes_square_filename_idx" ON "files" USING btree ("sizes_square_filename");
  CREATE INDEX "files_sizes_small_sizes_small_filename_idx" ON "files" USING btree ("sizes_small_filename");
  CREATE INDEX "files_sizes_medium_sizes_medium_filename_idx" ON "files" USING btree ("sizes_medium_filename");
  CREATE INDEX "files_sizes_large_sizes_large_filename_idx" ON "files" USING btree ("sizes_large_filename");
  CREATE INDEX "files_sizes_xlarge_sizes_xlarge_filename_idx" ON "files" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "files_sizes_og_sizes_og_filename_idx" ON "files" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "categories_title_idx" ON "categories" USING btree ("title");
  CREATE INDEX "categories_created_by_idx" ON "categories" USING btree ("created_by_id");
  CREATE INDEX "categories_edited_by_idx" ON "categories" USING btree ("edited_by_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_commission_idx" ON "posts" USING btree ("commission_id");
  CREATE INDEX "posts_subsection_idx" ON "posts" USING btree ("subsection_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_edited_by_idx" ON "posts" USING btree ("edited_by_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_version_commission_idx" ON "_posts_v" USING btree ("version_commission_id");
  CREATE INDEX "_posts_v_version_version_subsection_idx" ON "_posts_v" USING btree ("version_subsection_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_edited_by_idx" ON "_posts_v" USING btree ("version_edited_by_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version_deleted_at_idx" ON "_posts_v" USING btree ("version_deleted_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter" USING btree ("email");
  CREATE INDEX "newsletter_edited_by_idx" ON "newsletter" USING btree ("edited_by_id");
  CREATE INDEX "newsletter_updated_at_idx" ON "newsletter" USING btree ("updated_at");
  CREATE INDEX "newsletter_created_at_idx" ON "newsletter" USING btree ("created_at");
  CREATE INDEX "managements_created_by_idx" ON "managements" USING btree ("created_by_id");
  CREATE INDEX "managements_edited_by_idx" ON "managements" USING btree ("edited_by_id");
  CREATE INDEX "managements_updated_at_idx" ON "managements" USING btree ("updated_at");
  CREATE INDEX "managements_created_at_idx" ON "managements" USING btree ("created_at");
  CREATE INDEX "board_photo_idx" ON "board" USING btree ("photo_id");
  CREATE INDEX "board_management_idx" ON "board" USING btree ("management_id");
  CREATE INDEX "board_created_by_idx" ON "board" USING btree ("created_by_id");
  CREATE INDEX "board_edited_by_idx" ON "board" USING btree ("edited_by_id");
  CREATE INDEX "board_updated_at_idx" ON "board" USING btree ("updated_at");
  CREATE INDEX "board_created_at_idx" ON "board" USING btree ("created_at");
  CREATE INDEX "counselors_management_idx" ON "counselors" USING btree ("management_id");
  CREATE INDEX "counselors_created_by_idx" ON "counselors" USING btree ("created_by_id");
  CREATE INDEX "counselors_edited_by_idx" ON "counselors" USING btree ("edited_by_id");
  CREATE INDEX "counselors_updated_at_idx" ON "counselors" USING btree ("updated_at");
  CREATE INDEX "counselors_created_at_idx" ON "counselors" USING btree ("created_at");
  CREATE INDEX "state_council_digests_created_by_idx" ON "state_council_digests" USING btree ("created_by_id");
  CREATE INDEX "state_council_digests_edited_by_idx" ON "state_council_digests" USING btree ("edited_by_id");
  CREATE INDEX "state_council_digests_updated_at_idx" ON "state_council_digests" USING btree ("updated_at");
  CREATE INDEX "state_council_digests_created_at_idx" ON "state_council_digests" USING btree ("created_at");
  CREATE INDEX "adjudicating_chamber_created_by_idx" ON "adjudicating_chamber" USING btree ("created_by_id");
  CREATE INDEX "adjudicating_chamber_edited_by_idx" ON "adjudicating_chamber" USING btree ("edited_by_id");
  CREATE INDEX "adjudicating_chamber_updated_at_idx" ON "adjudicating_chamber" USING btree ("updated_at");
  CREATE INDEX "adjudicating_chamber_created_at_idx" ON "adjudicating_chamber" USING btree ("created_at");
  CREATE INDEX "members_adjudicating_chamber_adjudicating_chamber_idx" ON "members_adjudicating_chamber" USING btree ("adjudicating_chamber_id");
  CREATE INDEX "members_adjudicating_chamber_created_by_idx" ON "members_adjudicating_chamber" USING btree ("created_by_id");
  CREATE INDEX "members_adjudicating_chamber_edited_by_idx" ON "members_adjudicating_chamber" USING btree ("edited_by_id");
  CREATE INDEX "members_adjudicating_chamber_updated_at_idx" ON "members_adjudicating_chamber" USING btree ("updated_at");
  CREATE INDEX "members_adjudicating_chamber_created_at_idx" ON "members_adjudicating_chamber" USING btree ("created_at");
  CREATE INDEX "ted_members_composition_idx" ON "ted_members" USING btree ("composition_id");
  CREATE INDEX "ted_members_created_by_idx" ON "ted_members" USING btree ("created_by_id");
  CREATE INDEX "ted_members_edited_by_idx" ON "ted_members" USING btree ("edited_by_id");
  CREATE INDEX "ted_members_updated_at_idx" ON "ted_members" USING btree ("updated_at");
  CREATE INDEX "ted_members_created_at_idx" ON "ted_members" USING btree ("created_at");
  CREATE INDEX "composition_created_by_idx" ON "composition" USING btree ("created_by_id");
  CREATE INDEX "composition_edited_by_idx" ON "composition" USING btree ("edited_by_id");
  CREATE INDEX "composition_updated_at_idx" ON "composition" USING btree ("updated_at");
  CREATE INDEX "composition_created_at_idx" ON "composition" USING btree ("created_at");
  CREATE INDEX "ted_council_digests_created_by_idx" ON "ted_council_digests" USING btree ("created_by_id");
  CREATE INDEX "ted_council_digests_edited_by_idx" ON "ted_council_digests" USING btree ("edited_by_id");
  CREATE INDEX "ted_council_digests_updated_at_idx" ON "ted_council_digests" USING btree ("updated_at");
  CREATE INDEX "ted_council_digests_created_at_idx" ON "ted_council_digests" USING btree ("created_at");
  CREATE INDEX "legislations_ted_type_idx" ON "legislations_ted" USING btree ("type_id");
  CREATE INDEX "legislations_ted_file_idx" ON "legislations_ted" USING btree ("file_id");
  CREATE INDEX "legislations_ted_created_by_idx" ON "legislations_ted" USING btree ("created_by_id");
  CREATE INDEX "legislations_ted_edited_by_idx" ON "legislations_ted" USING btree ("edited_by_id");
  CREATE INDEX "legislations_ted_updated_at_idx" ON "legislations_ted" USING btree ("updated_at");
  CREATE INDEX "legislations_ted_created_at_idx" ON "legislations_ted" USING btree ("created_at");
  CREATE INDEX "legislations_ted_types_created_by_idx" ON "legislations_ted_types" USING btree ("created_by_id");
  CREATE INDEX "legislations_ted_types_edited_by_idx" ON "legislations_ted_types" USING btree ("edited_by_id");
  CREATE INDEX "legislations_ted_types_updated_at_idx" ON "legislations_ted_types" USING btree ("updated_at");
  CREATE INDEX "legislations_ted_types_created_at_idx" ON "legislations_ted_types" USING btree ("created_at");
  CREATE INDEX "calendar_ted_created_by_idx" ON "calendar_ted" USING btree ("created_by_id");
  CREATE INDEX "calendar_ted_edited_by_idx" ON "calendar_ted" USING btree ("edited_by_id");
  CREATE INDEX "calendar_ted_updated_at_idx" ON "calendar_ted" USING btree ("updated_at");
  CREATE INDEX "calendar_ted_created_at_idx" ON "calendar_ted" USING btree ("created_at");
  CREATE INDEX "commissions_focus_areas_order_idx" ON "commissions_focus_areas" USING btree ("_order");
  CREATE INDEX "commissions_focus_areas_parent_id_idx" ON "commissions_focus_areas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "commissions_title_idx" ON "commissions" USING btree ("title");
  CREATE INDEX "commissions_area_idx" ON "commissions" USING btree ("area_id");
  CREATE INDEX "commissions_subsection_idx" ON "commissions" USING btree ("subsection_id");
  CREATE UNIQUE INDEX "commissions_slug_idx" ON "commissions" USING btree ("slug");
  CREATE INDEX "commissions_created_by_idx" ON "commissions" USING btree ("created_by_id");
  CREATE INDEX "commissions_edited_by_idx" ON "commissions" USING btree ("edited_by_id");
  CREATE INDEX "commissions_updated_at_idx" ON "commissions" USING btree ("updated_at");
  CREATE INDEX "commissions_created_at_idx" ON "commissions" USING btree ("created_at");
  CREATE INDEX "commission_members_image_idx" ON "commission_members" USING btree ("image_id");
  CREATE INDEX "commission_members_commission_idx" ON "commission_members" USING btree ("commission_id");
  CREATE INDEX "commission_members_created_by_idx" ON "commission_members" USING btree ("created_by_id");
  CREATE INDEX "commission_members_edited_by_idx" ON "commission_members" USING btree ("edited_by_id");
  CREATE INDEX "commission_members_updated_at_idx" ON "commission_members" USING btree ("updated_at");
  CREATE INDEX "commission_members_created_at_idx" ON "commission_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "commission_areas_title_idx" ON "commission_areas" USING btree ("title");
  CREATE INDEX "commission_areas_created_by_idx" ON "commission_areas" USING btree ("created_by_id");
  CREATE INDEX "commission_areas_edited_by_idx" ON "commission_areas" USING btree ("edited_by_id");
  CREATE INDEX "commission_areas_updated_at_idx" ON "commission_areas" USING btree ("updated_at");
  CREATE INDEX "commission_areas_created_at_idx" ON "commission_areas" USING btree ("created_at");
  CREATE UNIQUE INDEX "subsections_title_idx" ON "subsections" USING btree ("title");
  CREATE INDEX "subsections_region_idx" ON "subsections" USING btree ("region_id");
  CREATE UNIQUE INDEX "subsections_slug_idx" ON "subsections" USING btree ("slug");
  CREATE INDEX "subsections_created_by_idx" ON "subsections" USING btree ("created_by_id");
  CREATE INDEX "subsections_edited_by_idx" ON "subsections" USING btree ("edited_by_id");
  CREATE INDEX "subsections_updated_at_idx" ON "subsections" USING btree ("updated_at");
  CREATE INDEX "subsections_created_at_idx" ON "subsections" USING btree ("created_at");
  CREATE UNIQUE INDEX "subsection_regions_title_idx" ON "subsection_regions" USING btree ("title");
  CREATE INDEX "subsection_regions_created_by_idx" ON "subsection_regions" USING btree ("created_by_id");
  CREATE INDEX "subsection_regions_edited_by_idx" ON "subsection_regions" USING btree ("edited_by_id");
  CREATE INDEX "subsection_regions_updated_at_idx" ON "subsection_regions" USING btree ("updated_at");
  CREATE INDEX "subsection_regions_created_at_idx" ON "subsection_regions" USING btree ("created_at");
  CREATE INDEX "subsection_members_image_idx" ON "subsection_members" USING btree ("image_id");
  CREATE INDEX "subsection_members_subsection_idx" ON "subsection_members" USING btree ("subsection_id");
  CREATE INDEX "subsection_members_management_idx" ON "subsection_members" USING btree ("management_id");
  CREATE INDEX "subsection_members_created_by_idx" ON "subsection_members" USING btree ("created_by_id");
  CREATE INDEX "subsection_members_edited_by_idx" ON "subsection_members" USING btree ("edited_by_id");
  CREATE INDEX "subsection_members_updated_at_idx" ON "subsection_members" USING btree ("updated_at");
  CREATE INDEX "subsection_members_created_at_idx" ON "subsection_members" USING btree ("created_at");
  CREATE INDEX "subsection_rooms_subsection_idx" ON "subsection_rooms" USING btree ("subsection_id");
  CREATE INDEX "subsection_rooms_created_by_idx" ON "subsection_rooms" USING btree ("created_by_id");
  CREATE INDEX "subsection_rooms_edited_by_idx" ON "subsection_rooms" USING btree ("edited_by_id");
  CREATE INDEX "subsection_rooms_updated_at_idx" ON "subsection_rooms" USING btree ("updated_at");
  CREATE INDEX "subsection_rooms_created_at_idx" ON "subsection_rooms" USING btree ("created_at");
  CREATE INDEX "urh_honorarium_file_idx" ON "urh_honorarium" USING btree ("file_id");
  CREATE INDEX "urh_honorarium_created_by_idx" ON "urh_honorarium" USING btree ("created_by_id");
  CREATE INDEX "urh_honorarium_edited_by_idx" ON "urh_honorarium" USING btree ("edited_by_id");
  CREATE INDEX "urh_honorarium_updated_at_idx" ON "urh_honorarium" USING btree ("updated_at");
  CREATE INDEX "urh_honorarium_created_at_idx" ON "urh_honorarium" USING btree ("created_at");
  CREATE INDEX "legislations_type_idx" ON "legislations" USING btree ("type_id");
  CREATE INDEX "legislations_file_idx" ON "legislations" USING btree ("file_id");
  CREATE INDEX "legislations_created_by_idx" ON "legislations" USING btree ("created_by_id");
  CREATE INDEX "legislations_edited_by_idx" ON "legislations" USING btree ("edited_by_id");
  CREATE INDEX "legislations_updated_at_idx" ON "legislations" USING btree ("updated_at");
  CREATE INDEX "legislations_created_at_idx" ON "legislations" USING btree ("created_at");
  CREATE INDEX "legislations_types_created_by_idx" ON "legislations_types" USING btree ("created_by_id");
  CREATE INDEX "legislations_types_edited_by_idx" ON "legislations_types" USING btree ("edited_by_id");
  CREATE INDEX "legislations_types_updated_at_idx" ON "legislations_types" USING btree ("updated_at");
  CREATE INDEX "legislations_types_created_at_idx" ON "legislations_types" USING btree ("created_at");
  CREATE INDEX "lawyers_sessions_order_idx" ON "lawyers_sessions" USING btree ("_order");
  CREATE INDEX "lawyers_sessions_parent_id_idx" ON "lawyers_sessions" USING btree ("_parent_id");
  CREATE INDEX "lawyers_created_by_idx" ON "lawyers" USING btree ("created_by_id");
  CREATE INDEX "lawyers_edited_by_idx" ON "lawyers" USING btree ("edited_by_id");
  CREATE INDEX "lawyers_updated_at_idx" ON "lawyers" USING btree ("updated_at");
  CREATE INDEX "lawyers_created_at_idx" ON "lawyers" USING btree ("created_at");
  CREATE UNIQUE INDEX "lawyers_email_idx" ON "lawyers" USING btree ("email");
  CREATE INDEX "events_included_order_idx" ON "events_included" USING btree ("_order");
  CREATE INDEX "events_included_parent_id_idx" ON "events_included" USING btree ("_parent_id");
  CREATE INDEX "events_requirements_order_idx" ON "events_requirements" USING btree ("_order");
  CREATE INDEX "events_requirements_parent_id_idx" ON "events_requirements" USING btree ("_parent_id");
  CREATE INDEX "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE INDEX "events_rooms_room_schedule_order_idx" ON "events_rooms_room_schedule" USING btree ("_order");
  CREATE INDEX "events_rooms_room_schedule_parent_id_idx" ON "events_rooms_room_schedule" USING btree ("_parent_id");
  CREATE INDEX "events_rooms_room_schedule_speaker_idx" ON "events_rooms_room_schedule" USING btree ("speaker_id");
  CREATE INDEX "events_rooms_order_idx" ON "events_rooms" USING btree ("_order");
  CREATE INDEX "events_rooms_parent_id_idx" ON "events_rooms" USING btree ("_parent_id");
  CREATE INDEX "events_program_order_idx" ON "events_program" USING btree ("_order");
  CREATE INDEX "events_program_parent_id_idx" ON "events_program" USING btree ("_parent_id");
  CREATE INDEX "events_program_speaker_idx" ON "events_program" USING btree ("speaker_id");
  CREATE INDEX "events_ticket_types_order_idx" ON "events_ticket_types" USING btree ("_order");
  CREATE INDEX "events_ticket_types_parent_id_idx" ON "events_ticket_types" USING btree ("_parent_id");
  CREATE INDEX "events_ticket_types_participant_category_idx" ON "events_ticket_types" USING btree ("participant_category_id");
  CREATE INDEX "events_group_discount_tiers_order_idx" ON "events_group_discount_tiers" USING btree ("_order");
  CREATE INDEX "events_group_discount_tiers_parent_id_idx" ON "events_group_discount_tiers" USING btree ("_parent_id");
  CREATE INDEX "events_commission_idx" ON "events" USING btree ("commission_id");
  CREATE INDEX "events_subsection_idx" ON "events" USING btree ("subsection_id");
  CREATE INDEX "events_featured_image_idx" ON "events" USING btree ("featured_image_id");
  CREATE INDEX "events_certificate_template_idx" ON "events" USING btree ("certificate_template_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_created_by_idx" ON "events" USING btree ("created_by_id");
  CREATE INDEX "events_edited_by_idx" ON "events" USING btree ("edited_by_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_speakers_id_idx" ON "events_rels" USING btree ("speakers_id");
  CREATE INDEX "speakers_photo_idx" ON "speakers" USING btree ("photo_id");
  CREATE INDEX "speakers_created_by_idx" ON "speakers" USING btree ("created_by_id");
  CREATE INDEX "speakers_edited_by_idx" ON "speakers" USING btree ("edited_by_id");
  CREATE INDEX "speakers_updated_at_idx" ON "speakers" USING btree ("updated_at");
  CREATE INDEX "speakers_created_at_idx" ON "speakers" USING btree ("created_at");
  CREATE INDEX "registrations_tickets_order_idx" ON "registrations_tickets" USING btree ("_order");
  CREATE INDEX "registrations_tickets_parent_id_idx" ON "registrations_tickets" USING btree ("_parent_id");
  CREATE INDEX "registrations_tickets_ticket_type_idx" ON "registrations_tickets" USING btree ("ticket_type_id");
  CREATE INDEX "registrations_tickets_checkin_by_idx" ON "registrations_tickets" USING btree ("checkin_by_id");
  CREATE INDEX "registrations_room_selections_order_idx" ON "registrations_room_selections" USING btree ("_order");
  CREATE INDEX "registrations_room_selections_parent_id_idx" ON "registrations_room_selections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "registrations_registration_code_idx" ON "registrations" USING btree ("registration_code");
  CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");
  CREATE INDEX "registrations_user_idx" ON "registrations" USING btree ("user_id");
  CREATE INDEX "registrations_created_by_idx" ON "registrations" USING btree ("created_by_id");
  CREATE INDEX "registrations_edited_by_idx" ON "registrations" USING btree ("edited_by_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "certificates_certificate_number_idx" ON "certificates" USING btree ("certificate_number");
  CREATE INDEX "certificates_registration_idx" ON "certificates" USING btree ("registration_id");
  CREATE INDEX "certificates_event_idx" ON "certificates" USING btree ("event_id");
  CREATE INDEX "certificates_original_certificate_id_idx" ON "certificates" USING btree ("original_certificate_id_id");
  CREATE INDEX "certificates_pdf_file_idx" ON "certificates" USING btree ("pdf_file_id");
  CREATE INDEX "certificates_created_by_idx" ON "certificates" USING btree ("created_by_id");
  CREATE INDEX "certificates_updated_at_idx" ON "certificates" USING btree ("updated_at");
  CREATE INDEX "certificates_created_at_idx" ON "certificates" USING btree ("created_at");
  CREATE UNIQUE INDEX "participant_categories_code_idx" ON "participant_categories" USING btree ("code");
  CREATE INDEX "participant_categories_created_by_idx" ON "participant_categories" USING btree ("created_by_id");
  CREATE INDEX "participant_categories_edited_by_idx" ON "participant_categories" USING btree ("edited_by_id");
  CREATE INDEX "participant_categories_updated_at_idx" ON "participant_categories" USING btree ("updated_at");
  CREATE INDEX "participant_categories_created_at_idx" ON "participant_categories" USING btree ("created_at");
  CREATE INDEX "checkins_registration_idx" ON "checkins" USING btree ("registration_id");
  CREATE INDEX "checkins_event_idx" ON "checkins" USING btree ("event_id");
  CREATE INDEX "checkins_checkin_by_idx" ON "checkins" USING btree ("checkin_by_id");
  CREATE INDEX "checkins_created_by_idx" ON "checkins" USING btree ("created_by_id");
  CREATE INDEX "checkins_updated_at_idx" ON "checkins" USING btree ("updated_at");
  CREATE INDEX "checkins_created_at_idx" ON "checkins" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_populated_authors_order_idx" ON "search_populated_authors" USING btree ("_order");
  CREATE INDEX "search_populated_authors_parent_id_idx" ON "search_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "search_featured_image_idx" ON "search" USING btree ("featured_image_id");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "file_folders_folder_type_order_idx" ON "file_folders_folder_type" USING btree ("order");
  CREATE INDEX "file_folders_folder_type_parent_idx" ON "file_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "file_folders_name_idx" ON "file_folders" USING btree ("name");
  CREATE INDEX "file_folders_folder_idx" ON "file_folders" USING btree ("folder_id");
  CREATE INDEX "file_folders_updated_at_idx" ON "file_folders" USING btree ("updated_at");
  CREATE INDEX "file_folders_created_at_idx" ON "file_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_files_id_idx" ON "payload_locked_documents_rels" USING btree ("files_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_id");
  CREATE INDEX "payload_locked_documents_rels_managements_id_idx" ON "payload_locked_documents_rels" USING btree ("managements_id");
  CREATE INDEX "payload_locked_documents_rels_board_id_idx" ON "payload_locked_documents_rels" USING btree ("board_id");
  CREATE INDEX "payload_locked_documents_rels_counselors_id_idx" ON "payload_locked_documents_rels" USING btree ("counselors_id");
  CREATE INDEX "payload_locked_documents_rels_state_council_digests_id_idx" ON "payload_locked_documents_rels" USING btree ("state_council_digests_id");
  CREATE INDEX "payload_locked_documents_rels_adjudicating_chamber_id_idx" ON "payload_locked_documents_rels" USING btree ("adjudicating_chamber_id");
  CREATE INDEX "payload_locked_documents_rels_members_adjudicating_chamb_idx" ON "payload_locked_documents_rels" USING btree ("members_adjudicating_chamber_id");
  CREATE INDEX "payload_locked_documents_rels_ted_members_id_idx" ON "payload_locked_documents_rels" USING btree ("ted_members_id");
  CREATE INDEX "payload_locked_documents_rels_composition_id_idx" ON "payload_locked_documents_rels" USING btree ("composition_id");
  CREATE INDEX "payload_locked_documents_rels_ted_council_digests_id_idx" ON "payload_locked_documents_rels" USING btree ("ted_council_digests_id");
  CREATE INDEX "payload_locked_documents_rels_legislations_ted_id_idx" ON "payload_locked_documents_rels" USING btree ("legislations_ted_id");
  CREATE INDEX "payload_locked_documents_rels_legislations_ted_types_id_idx" ON "payload_locked_documents_rels" USING btree ("legislations_ted_types_id");
  CREATE INDEX "payload_locked_documents_rels_calendar_ted_id_idx" ON "payload_locked_documents_rels" USING btree ("calendar_ted_id");
  CREATE INDEX "payload_locked_documents_rels_commissions_id_idx" ON "payload_locked_documents_rels" USING btree ("commissions_id");
  CREATE INDEX "payload_locked_documents_rels_commission_members_id_idx" ON "payload_locked_documents_rels" USING btree ("commission_members_id");
  CREATE INDEX "payload_locked_documents_rels_commission_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("commission_areas_id");
  CREATE INDEX "payload_locked_documents_rels_subsections_id_idx" ON "payload_locked_documents_rels" USING btree ("subsections_id");
  CREATE INDEX "payload_locked_documents_rels_subsection_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("subsection_regions_id");
  CREATE INDEX "payload_locked_documents_rels_subsection_members_id_idx" ON "payload_locked_documents_rels" USING btree ("subsection_members_id");
  CREATE INDEX "payload_locked_documents_rels_subsection_rooms_id_idx" ON "payload_locked_documents_rels" USING btree ("subsection_rooms_id");
  CREATE INDEX "payload_locked_documents_rels_urh_honorarium_id_idx" ON "payload_locked_documents_rels" USING btree ("urh_honorarium_id");
  CREATE INDEX "payload_locked_documents_rels_legislations_id_idx" ON "payload_locked_documents_rels" USING btree ("legislations_id");
  CREATE INDEX "payload_locked_documents_rels_legislations_types_id_idx" ON "payload_locked_documents_rels" USING btree ("legislations_types_id");
  CREATE INDEX "payload_locked_documents_rels_lawyers_id_idx" ON "payload_locked_documents_rels" USING btree ("lawyers_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_speakers_id_idx" ON "payload_locked_documents_rels" USING btree ("speakers_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_id");
  CREATE INDEX "payload_locked_documents_rels_participant_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("participant_categories_id");
  CREATE INDEX "payload_locked_documents_rels_checkins_id_idx" ON "payload_locked_documents_rels" USING btree ("checkins_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_file_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("file_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_lawyers_id_idx" ON "payload_preferences_rels" USING btree ("lawyers_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "files" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "newsletter" CASCADE;
  DROP TABLE "managements" CASCADE;
  DROP TABLE "board" CASCADE;
  DROP TABLE "counselors" CASCADE;
  DROP TABLE "state_council_digests" CASCADE;
  DROP TABLE "adjudicating_chamber" CASCADE;
  DROP TABLE "members_adjudicating_chamber" CASCADE;
  DROP TABLE "ted_members" CASCADE;
  DROP TABLE "composition" CASCADE;
  DROP TABLE "ted_council_digests" CASCADE;
  DROP TABLE "legislations_ted" CASCADE;
  DROP TABLE "legislations_ted_types" CASCADE;
  DROP TABLE "calendar_ted" CASCADE;
  DROP TABLE "commissions_focus_areas" CASCADE;
  DROP TABLE "commissions" CASCADE;
  DROP TABLE "commission_members" CASCADE;
  DROP TABLE "commission_areas" CASCADE;
  DROP TABLE "subsections" CASCADE;
  DROP TABLE "subsection_regions" CASCADE;
  DROP TABLE "subsection_members" CASCADE;
  DROP TABLE "subsection_rooms" CASCADE;
  DROP TABLE "urh_honorarium" CASCADE;
  DROP TABLE "legislations" CASCADE;
  DROP TABLE "legislations_types" CASCADE;
  DROP TABLE "lawyers_sessions" CASCADE;
  DROP TABLE "lawyers" CASCADE;
  DROP TABLE "events_included" CASCADE;
  DROP TABLE "events_requirements" CASCADE;
  DROP TABLE "events_gallery" CASCADE;
  DROP TABLE "events_rooms_room_schedule" CASCADE;
  DROP TABLE "events_rooms" CASCADE;
  DROP TABLE "events_program" CASCADE;
  DROP TABLE "events_ticket_types" CASCADE;
  DROP TABLE "events_group_discount_tiers" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "speakers" CASCADE;
  DROP TABLE "registrations_tickets" CASCADE;
  DROP TABLE "registrations_room_selections" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "certificates" CASCADE;
  DROP TABLE "participant_categories" CASCADE;
  DROP TABLE "checkins" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search_populated_authors" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "file_folders_folder_type" CASCADE;
  DROP TABLE "file_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_newsletter_status";
  DROP TYPE "public"."enum_board_position";
  DROP TYPE "public"."enum_counselors_council_type";
  DROP TYPE "public"."enum_counselors_position_type";
  DROP TYPE "public"."enum_members_adjudicating_chamber_position";
  DROP TYPE "public"."enum_ted_members_position";
  DROP TYPE "public"."enum_ted_members_member_type";
  DROP TYPE "public"."enum_commissions_type";
  DROP TYPE "public"."enum_commission_members_position";
  DROP TYPE "public"."enum_subsection_members_position";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_events_event_type";
  DROP TYPE "public"."enum_events_modality";
  DROP TYPE "public"."enum_events_streaming_platform";
  DROP TYPE "public"."enum_events_registration_type";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum_registrations_tickets_ticket_status";
  DROP TYPE "public"."enum_registrations_payment_status";
  DROP TYPE "public"."enum_registrations_payment_method";
  DROP TYPE "public"."enum_registrations_status";
  DROP TYPE "public"."enum_certificates_status";
  DROP TYPE "public"."enum_checkins_checkin_type";
  DROP TYPE "public"."enum_checkins_checkin_method";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_file_folders_folder_type";`)
}

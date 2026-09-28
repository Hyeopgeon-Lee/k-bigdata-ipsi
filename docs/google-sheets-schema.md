# Google Sheets CMS 스키마

모든 시트의 첫 행은 아래 컬럼명과 정확히 일치해야 합니다. active는 TRUE/FALSE, 날짜·시간은 ISO 8601(+09:00 권장), sort_order는 숫자입니다.

| 시트 | 컬럼 | 자료형 | 필수 | 설명 / 예시 |
+|---|---|---|---|---|
+| 01_site_config | key,value,type,description,active | 문자열 혼합 | key,value,active | admission_year / 2027 |
+| 02_departments | dept_id,slug,name,short_name,tagline,category,keywords,official_url,hero_image,sort_order,active | 문자열/숫자/불리언 | dept_id,slug,name,official_url,active | BIGDATA / bigdata |
+| 03_compare_items | dept_id,item_key,label,value,sort_order,active | 문자열/숫자/불리언 | dept_id,item_key,value,active | BIGDATA / interests |
+| 04_admission_schedule | year,round_id,round_name,application_start,application_end,interview_date,result_date,registration_start,registration_end,apply_url,guide_url,source_url,status_override,sort_order,active | 날짜 포함 혼합 | year,round_id,start,end,source_url,active | 2027 / SUSI1 / AUTO |
+| 05_admission_guide | year,section,title,content,source_url,sort_order,active | 혼합 | year,section,title,active | 2027 / eligibility |
+| 06_admission_results | year,round_id,dept_id,quota,applicants,competition_rate,reference_grade,note,source_url,active | 혼합 | year,round_id,dept_id,source_url,active | 공식 자료만 입력 |
+| 07_outcomes | outcome_id,dept_id,type,year,title,subtitle,person_name_masked,description,image_url,link_url,source_url,featured,sort_order,active | 혼합 | outcome_id,dept_id,type,title,source_url,active | type=EMPLOYMENT/PROJECT/AWARD/GRADUATE/CERTIFICATE |
+| 08_media | media_id,dept_id,category,year,title,thumbnail_url,media_url,media_type,alt_text,source_url,featured,sort_order,active | 혼합 | media_id,dept_id,title,media_url,alt_text,active | IMAGE/VIDEO |
+| 09_faq | faq_id,category,dept_id,question,answer,source_url,sort_order,active | 혼합 | faq_id,category,question,answer,source_url,active | dept_id=ALL 가능 |
+| 10_finder_questions | question_id,question,sort_order,active | 혼합 | 전체 | Q1 |
+| 11_finder_options | option_id,question_id,label,BIGDATA,CONTENT,HEALTH,SECURITY,JEWELRY,FASHION,sort_order,active | 혼합 | 전체 | 점수는 숫자 |
+| 12_testimonials | testimonial_id,dept_id,type,graduation_year,name_masked,company,role,headline,quote,featured,sort_order,active | 혼합 | id,dept_id,quote,active | 이름은 김○○ 형식 |
+| 13_links | key,round_id,label,url,type,sort_order,active | 혼합 | key,label,url,active | apply_susi1 |

## 검증 규칙

- 공식 URL과 source_url을 함께 기록합니다. 확인되지 않은 수치는 빈 셀로 둡니다.
- 이미지는 시트에 넣지 않고 URL만 저장하며 alt_text를 필수로 관리합니다.
- 수시2차·정시 apply_url이 미확정이면 빈 값으로 두며, 프런트엔드는 공식 원서접수 안내로 대체합니다.
- data_version을 갱신해 운영 변경을 추적합니다.

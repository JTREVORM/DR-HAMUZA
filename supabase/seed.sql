-- ============================================================================
--  DR SALONGO HAMUZA — Seed data
--  Run AFTER supabase/schema.sql. Safe to re-run: existing rows are left as
--  they are, so anything edited in the dashboard is never overwritten.
--
--  The same thirteen services can also be loaded from the dashboard itself:
--  Admin -> Services -> "Load default services".
-- ============================================================================

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

insert into public.services (
  slug, title, short_description, description, body, icon, cover_image,
  bullet_points, notice, sort_order, is_published, is_featured,
  seo_title, seo_description
) values
  ('relationship-and-love-matters', 'Relationship & Love Matters', 'Traditional consultation for people carrying worries about their relationship, their marriage or a separation they do not understand.', 'Relationships carry some of the heaviest questions a person brings to a traditional healer. Dr Salongo Hamuza offers traditional and spiritual consultation for individuals and couples who are facing misunderstanding, distance, separation or difficulty in reconciling, and who wish to discuss the matter within a traditional framework.', '## What this consultation covers

People come to Dr Salongo Hamuza when a relationship has become difficult to read. Sometimes a couple has been quarrelling for months without knowing where the quarrel began. Sometimes a partner has moved away and the family wants to understand what happened. Sometimes a person is simply preparing for marriage and wants to sit with an elder before taking the step.

In each case the consultation begins the same way: with listening. Dr Salongo Hamuza asks the person to describe the situation in their own words, in their own time, and to say plainly what they are hoping for. Nothing is assumed on the person''s behalf.

## How the conversation is held

Traditional consultation in Uganda is a patient practice. It is rooted in listening, in the reading of a situation according to traditional understanding, and in guidance that the person is free to accept or to leave. Dr Salongo Hamuza works in that tradition. The consultation is private, it is unhurried, and what is said in it stays between the healer and the person who came.

## Who this is for

- Individuals carrying a worry they have not been able to name
- Couples who wish to speak with an elder about a repeated difficulty
- Families concerned about a relationship between their people
- Anyone preparing for marriage who wants traditional guidance first

## What is asked of you

Come with the truth of the situation as you understand it. A consultation built on half a story cannot be a useful one. You are never asked to bring anyone else against their will, and you are never asked to do anything unlawful or harmful to another person.

## Speaking to someone else as well

Relationship difficulty often sits alongside other pressures — money, health, family expectation, or the safety of the people involved. Traditional consultation does not replace counselling, legal advice or medical care. Where a situation calls for those, Dr Salongo Hamuza will say so, and anyone who is in danger should contact the appropriate authorities or support services without delay.', 'heart', '', '["Misunderstandings and repeated quarrels between partners","Separation, distance and difficulty in reconciling","Marriage concerns and decisions about the future","Disagreement between families connected through a marriage","General guidance for people entering or rebuilding a relationship"]'::jsonb, 'Consultation is a conversation, not a promise. No outcome in another person’s heart or decisions is guaranteed, and nobody is ever asked to act against the law or against another person’s wellbeing.', 1, true, true, 'Relationship & Love Consultation | Dr Salongo Hamuza, Uganda', 'Traditional consultation in Uganda for relationship misunderstandings, separation, reconciliation and marriage concerns with Dr Salongo Hamuza.'),
  ('family-matters', 'Family Matters', 'Traditional guidance for households facing disagreement, domestic difficulty or a long-standing loss of harmony.', 'A family is the first place most people turn, and the hardest place to be in difficulty. Dr Salongo Hamuza offers traditional consultation to individuals and families who are living with disagreement, domestic strain or a quiet difficulty that has lasted a long time and that they would like to discuss in a traditional setting.', '## What this consultation covers

Family difficulties rarely arrive alone. A disagreement over land becomes a disagreement between brothers. A bereavement becomes a quarrel over what should happen next. A household that once ate together stops speaking. People bring these matters to Dr Salongo Hamuza when they want to understand them within a traditional framework, and when they want to speak to an elder rather than to a stranger.

## How the conversation is held

The consultation is private and unhurried. Dr Salongo Hamuza listens first, asks questions second, and gives guidance according to traditional practice. Family members may come alone or together — many people come alone first, to speak freely, before deciding whether to bring anybody else.

## Who this is for

- Individuals worried about the state of their household
- Parents and elders carrying responsibility for a wider family
- Relatives who wish to understand a long-standing disagreement
- Anyone who wants to speak with a traditional healer before taking a decision that will affect their family

## A word on serious situations

Some family difficulties are also safety matters, legal matters or health matters. Traditional consultation does not replace any of those. Where a situation calls for the police, a lawyer, a counsellor or a doctor, that is the right path, and Dr Salongo Hamuza will say so plainly.', 'users', '', '["Disagreements between relatives and between generations","Domestic challenges affecting the peace of a household","Concerns about family harmony and reconciliation","Personal worries that a person does not wish to discuss elsewhere","Guidance for the head of a family carrying responsibility for others"]'::jsonb, 'Traditional consultation is not a substitute for legal advice, counselling or the protection of the authorities. Anyone facing violence or danger at home should contact the police or an appropriate support service immediately.', 2, true, true, 'Family Matters Consultation | Dr Salongo Hamuza, Uganda', 'Traditional consultation in Uganda for family disagreements, domestic challenges and family harmony with Dr Salongo Hamuza.'),
  ('business-and-career', 'Business & Career Matters', 'Traditional consultation for business owners, traders and working people thinking about direction, progress and difficult decisions.', 'Dr Salongo Hamuza receives business owners, traders, employees and people building a career who wish to discuss their work within a traditional framework — the direction they are taking, the decisions in front of them, and the worries that come with carrying a business or a job.', '## What this consultation covers

Work carries its own weight. A trader watching a shop go quiet, an employee passed over year after year, a young person deciding whether to start something of their own — each arrives with a question that is partly practical and partly personal.

Dr Salongo Hamuza offers traditional consultation for these matters. The conversation is about direction, decision and the worry that sits underneath both. It is held according to traditional practice, and the person who comes decides for themselves what to do with the guidance they receive.

## How the conversation is held

The consultation is private. You are asked to describe the situation honestly: what the business or the work is, what has changed, what you are considering, and what you are afraid of. Dr Salongo Hamuza listens and responds within traditional understanding.

## What is not offered

This is an important point, and it is stated plainly. Traditional consultation does not produce money, and nobody should come expecting it to. There is no guarantee of profit, of a contract, of a promotion or of any financial outcome whatsoever. Anyone who promises you those things is not being honest with you.

What is offered is a traditional conversation about your situation, held with care, in confidence, by an elder who will listen.

## Alongside professional advice

Business decisions usually also need an accountant, a lawyer, a bank or a business adviser. Traditional consultation does not replace any of them and is not offered as an alternative to proper professional advice.', 'briefcase', '', '["Business owners and traders weighing a decision","Career development and professional direction","Work-related worries and workplace difficulty","Questions about timing, direction and next steps","Guidance for people starting out in business"]'::jsonb, 'No financial result, profit, contract, promotion or business outcome is promised or guaranteed. Consultation is traditional guidance only and is never a substitute for professional business, financial or legal advice.', 3, true, true, 'Business & Career Consultation | Dr Salongo Hamuza, Uganda', 'Traditional consultation in Uganda for business owners, traders and working people considering direction and progress. No outcomes are guaranteed.'),
  ('musicians-and-entertainment', 'Upcoming Musicians & Entertainment', 'Traditional consultation for musicians, performers and entertainers seeking guidance about their careers and personal development.', 'Uganda’s music and entertainment industry is demanding, and many young artists carry the weight of it alone. Dr Salongo Hamuza offers traditional consultation to musicians, performers, dancers, comedians and other entertainers who wish to discuss their career and their personal development in a traditional setting.', '## What this consultation covers

An upcoming artist lives with a particular kind of uncertainty. The work is public, the income is not steady, and the people around an artist often have their own interests at heart. Many musicians say the hardest part is not the music at all — it is deciding who to trust and which direction to take.

Dr Salongo Hamuza receives artists who want to sit with an elder and speak about that honestly. The consultation covers career direction, personal development, and the pressures that come with a life lived in front of other people.

## How the conversation is held

Privately, and without an audience. Many artists value that most. Nothing said in the consultation is published, shared or used for promotion unless the artist themselves asks for it and gives permission in writing.

## What is not offered

No consultation can deliver fame, a hit record, a booking, a contract or an audience. Those things are built through work, through craft and through time. Traditional consultation is guidance, held in confidence — nothing more is claimed for it.

## Who this is for

- Upcoming musicians and recording artists
- Performers, dancers, DJs, comedians and stage artists
- Anyone in the entertainment industry facing a personal or career decision', 'music', '', '["Upcoming musicians finding their direction","Performers and entertainers facing career decisions","Personal development alongside a public career","The pressure and isolation that come with performing life","Guidance for artists preparing for a significant step"]'::jsonb, 'No fame, chart position, booking, contract, audience or career outcome is promised or guaranteed. This is traditional consultation only.', 4, true, true, 'Consultation for Musicians & Entertainers | Dr Salongo Hamuza', 'Traditional consultation in Uganda for upcoming musicians, performers and entertainers seeking career and personal guidance.'),
  ('police-and-army-career-matters', 'Police & Army Career Matters', 'Traditional consultation for men and women serving in the security services who wish to discuss career and professional matters.', 'Men and women serving in the police, the army and other security services carry responsibilities that are difficult to discuss outside the service. Dr Salongo Hamuza offers traditional consultation to serving personnel who wish to talk about their career, their professional direction and the personal weight of the work.', '## What this consultation covers

Service life is demanding in ways that are hard to explain to people outside it. Long postings, irregular hours, danger, distance from family, and a career structure that can feel slow and impersonal — all of it accumulates.

Dr Salongo Hamuza offers traditional consultation to serving men and women who want to speak about that, and about the direction of their professional life, with an elder who will listen in confidence.

## What is explicitly not offered

This must be stated without ambiguity. Promotion, rank and appointment in the police and the armed forces are decided by lawful official processes. This consultation has no connection to those processes and no ability to influence them.

Nobody is offered, and nobody should ask for, any form of interference with a promotion board, an appointment, a posting, an investigation or a disciplinary matter. Requests of that kind are declined. Nothing offered here involves bribery, manipulation or any unlawful act.

## What is offered

A private, traditional conversation about your career, your direction and the personal weight you are carrying. That is the whole of it, and it is offered with respect for the service you give.', 'shield', '', '["Career direction within a long period of service","Professional decisions and postings","The personal strain that comes with security work","Family matters affected by the demands of service","Guidance for personnel considering a change of direction"]'::jsonb, 'Nothing unlawful is offered here. This consultation does not and cannot influence promotion boards, appointments, ranks, postings, disciplinary proceedings or any official process, and no bribery, manipulation or interference of any kind is provided or entertained.', 5, true, false, 'Consultation for Police & Army Personnel | Dr Salongo Hamuza', 'Traditional consultation in Uganda for serving police and army personnel on career and professional matters. No unlawful influence is offered.'),
  ('church-and-spiritual-matters', 'Church & Spiritual Matters', 'Traditional spiritual consultation relating to spiritual concerns and the responsibilities of leadership.', 'Dr Salongo Hamuza offers traditional spiritual consultation to people carrying spiritual questions and to those who hold leadership responsibility within a congregation or a community, and who wish to discuss those responsibilities in a traditional setting.', '## What this consultation covers

Leadership can be a lonely responsibility. People who lead others spiritually are expected to carry everyone else''s questions, and often have nowhere to bring their own. Others come simply with a spiritual concern they have lived with for a long time and want to discuss within a traditional understanding.

Dr Salongo Hamuza receives both, privately, and listens.

## How this is held

With respect. Uganda holds many faiths and many traditions side by side, and people who visit a traditional healer come from all of them. Nobody is asked to leave their faith, to change it, or to set it against anyone else''s.

## What is never offered

No consultation is ever directed against another person, another leader, another congregation or another faith. Requests to cause spiritual harm to a person are declined, without exception.

## Who this is for

- People carrying a personal spiritual question
- Those with responsibility for a congregation or community
- Anyone who wants a private, traditional conversation about a spiritual concern', 'church', '', '["Personal spiritual concerns and questions","The weight of leadership within a congregation or community","Guidance for people carrying responsibility for others","Traditional understanding of spiritual matters brought by visitors","Quiet, private conversation for those who cannot speak freely elsewhere"]'::jsonb, 'Consultation is offered with respect for every faith and every congregation. Nothing here is directed against any church, religion, leader or believer, and no spiritual harm to another person is ever offered or entertained.', 6, true, false, 'Church & Spiritual Consultation | Dr Salongo Hamuza, Uganda', 'Traditional spiritual consultation in Uganda for personal spiritual concerns and the responsibilities of leadership.'),
  ('travel-matters', 'Travel Matters', 'Consultation for people facing personal concerns about travel, journeys and opportunities away from home.', 'Travel changes a life, and the decision to travel is rarely a simple one. Dr Salongo Hamuza offers traditional consultation to people who are considering a journey, preparing to travel, or worried about an opportunity abroad, and who wish to discuss it in a traditional setting.', '## What this consultation covers

Many people who come to Dr Salongo Hamuza about travel are not really asking about a journey. They are asking whether to leave the people they love, whether the opportunity in front of them is what it appears to be, or why a plan they have worked towards for years has not moved.

The consultation is a place to speak about that honestly, with an elder, in private.

## An important warning

Visas, passports and immigration decisions belong entirely to governments and their official processes. No traditional healer can influence them, and anyone who tells you otherwise is deceiving you.

There are people in Uganda and abroad who take money from travellers with false promises about documents, jobs and passage. Please be careful. Use official channels and licensed agents only, verify every offer of work abroad independently, and never hand over your passport or a large sum of money on a promise.

## Who this is for

- People weighing a decision to travel
- Families concerned about a relative who has gone
- Anyone carrying worry about a journey, past or planned', 'plane', '', '["People considering a journey or an opportunity away from home","Worry about a journey that has been delayed or has not gone well","Family members concerned about somebody who has travelled","Personal preparation before a significant journey","Guidance for those weighing whether to go or to stay"]'::jsonb, 'Traditional consultation has no connection to visas, passports, immigration decisions, travel documents or the authorities of any country, and no assistance with any of those is offered. Use only official channels and licensed agents, and be careful of anyone who promises you travel documents.', 7, true, false, 'Travel Consultation | Dr Salongo Hamuza, Traditional Healer Uganda', 'Traditional consultation in Uganda for personal concerns about travel, journeys and opportunities away from home.'),
  ('fertility-and-family-consultation', 'Fertility & Family Consultation', 'Traditional consultation for individuals and couples carrying concerns about conception and building a family.', 'Few burdens are carried as quietly as the wish to have a child. Dr Salongo Hamuza offers traditional consultation to individuals and couples who are concerned about conception and family matters and who wish to speak about it within a traditional framework.', '## What this consultation covers

Couples who have been hoping for a child often describe the same thing: the silence around it. Relatives ask questions that wound. Friends announce pregnancies. The subject becomes impossible to raise even between husband and wife.

Dr Salongo Hamuza receives people carrying that weight and gives them a private place to speak about it — as a traditional consultation, held with care and without judgement.

## Please also see a doctor

This is said first and said clearly, because it matters more than anything else on this page.

Difficulty in conceiving has medical causes, and many of them can be identified and treated by qualified healthcare professionals. A doctor or a fertility clinic can carry out proper examinations for both partners and explain what is actually happening. That path is available, and it should be taken.

Traditional consultation does not diagnose a medical condition, does not treat one, and is never a reason to delay seeing a doctor. If you are worried about conception, please make a medical appointment as well.

## What is offered here

A confidential, traditional conversation for people who are carrying this privately, and who want to speak with an elder about the weight of it. No outcome is promised, and no medical claim is made.

## Who this is for

- Couples hoping to conceive
- Individuals carrying this worry alone
- Families facing pressure and expectation around children', 'baby', '', '["Couples who have been hoping to conceive","Individuals carrying this worry privately","The strain that this places on a marriage and a wider family","Family expectation and pressure from relatives","A confidential place to speak without judgement"]'::jsonb, 'Fertility and reproductive health are medical matters. Anyone concerned about conception should also see a qualified doctor or a fertility clinic, because many causes of difficulty in conceiving can be identified and treated medically. Traditional consultation does not diagnose, does not treat, and must never delay or replace medical care.', 8, true, true, 'Fertility & Family Consultation | Dr Salongo Hamuza, Uganda', 'Confidential traditional consultation in Uganda for individuals and couples concerned about conception. Medical care should always be sought alongside.'),
  ('children-and-education', 'Children & Education', 'Traditional consultation for parents concerned about children struggling with school work or concentration.', 'Dr Salongo Hamuza offers traditional consultation to parents and guardians worried about a child who is falling behind at school, struggling to concentrate, or who has changed in a way the family does not understand.', '## What this consultation covers

A parent watching a child fall behind often feels helpless. The reports come home each term saying the same thing. The child cannot explain it either. The family tries everything it knows.

Dr Salongo Hamuza receives parents and guardians in that position and offers traditional consultation about the situation.

## Start with the school and the clinic

Before or alongside anything else, two conversations are worth more than any other.

The first is with the child''s teachers. They see the child daily and often know precisely where the difficulty sits — a subject, a classroom, a friendship, a gap that opened up two years ago and was never closed.

The second is with a doctor. A great many children who are described as inattentive turn out to have trouble seeing the board, trouble hearing the teacher, poor sleep, an untreated illness or a specific learning difficulty. Every one of those is found by proper assessment, and most are helped once found.

Extra tuition, a change of seat in class or a reading assessment have turned around more school difficulties than anything else. Please try those routes.

## What is offered here

A traditional consultation for parents who want to discuss the situation with an elder. No claim is made about a child''s health, ability or future, and nothing here replaces the school or the clinic.', 'graduation-cap', '', '["Children falling behind in class","Difficulty with concentration and attention","A change in a child’s behaviour that worries the family","Pressure around examinations and school transitions","Guidance for parents who feel they have run out of options"]'::jsonb, 'Please also speak to the child’s teachers and, where concentration, learning or behaviour is a real concern, to a doctor or a qualified educational or child health professional. Learning difficulties, vision and hearing problems, and health conditions are common, treatable causes — and they are found by assessment, not by assumption.', 9, true, false, 'Children & Education Consultation | Dr Salongo Hamuza, Uganda', 'Traditional consultation in Uganda for parents concerned about children facing academic or concentration difficulties.'),
  ('fishermen-consultation', 'Fishermen', 'Traditional consultation for fishermen concerning their livelihood, their work on the water, their safety and traditional belief.', 'Fishing communities along Uganda’s lakes hold some of the country’s oldest traditions. Dr Salongo Hamuza offers traditional consultation to fishermen and fishing families concerning their livelihood, the conditions of their work, their safety on the water and the traditional beliefs that surround the lake.', '## What this consultation covers

Life on the lake has its own rhythm and its own risks. A season can fail. Fuel and nets cost more than the catch returns. Water that was calm in the morning turns in an afternoon. Fishing families carry all of this, and they carry it within a body of tradition that has surrounded the lakes for generations.

Dr Salongo Hamuza receives fishermen and fishing families who wish to discuss their livelihood, their work and those traditions in a traditional setting.

## A word about safety

This matters more than anything else on this page. Drowning takes lives on Uganda''s lakes every year, and most of those deaths are preventable.

Wear a life jacket, every time, including on short trips. Check the weather before you set out and turn back when it changes. Do not overload a boat. Do not take out a vessel you know to be unsound. Respect closed seasons and fishing regulations — they exist so that there will still be fish next year.

No consultation of any kind makes open water safe. Please do not treat it as though it does.

## Who this is for

- Fishermen working the lakes
- Families whose income depends on fishing
- Those considering a change of livelihood
- Anyone wishing to discuss the traditions of the lake with an elder', 'anchor', '', '["Fishermen facing a difficult season or a failing catch","Safety and the dangers of working on open water","Traditional beliefs and practices connected with the lake","Families dependent on fishing for their income","Guidance for those considering a change of livelihood"]'::jsonb, 'Nothing in traditional consultation makes open water safe. Always wear a life jacket, check the weather before setting out, respect closed seasons and fishing regulations, and never go out in a boat you know to be unsound.', 10, true, false, 'Traditional Consultation for Fishermen | Dr Salongo Hamuza, Uganda', 'Traditional consultation in Uganda for fishermen concerning livelihood, work on the water, safety and traditional beliefs.'),
  ('financial-and-personal-progress', 'Financial & Personal Progress', 'Traditional spiritual consultation about personal progress, opportunity and the direction of a life.', 'Dr Salongo Hamuza offers traditional spiritual consultation to people who feel their life has stopped moving — who are working without progress, weighing an opportunity, or trying to decide what direction to take next.', '## What this consultation covers

There is a particular kind of tiredness that comes from working hard and seeing nothing change. People describe it as being stuck: the years pass, the effort goes in, and the situation stays where it was. Others are standing in front of a decision — an opportunity, a move, a change of direction — and cannot see clearly.

Dr Salongo Hamuza offers traditional consultation to people in either position. It is a conversation about direction, held privately, according to traditional practice.

## What is not offered — stated plainly

Traditional consultation does not create money. There is no ritual, no consultation and no practice offered here that produces wealth, luck with money, employment, a windfall or a business result. No such outcome is promised, implied or guaranteed.

Anybody — whether a healer, a pastor, a broker or a stranger on the telephone — who tells you they can make money appear for you is deceiving you, and often intends to take from you. Please protect yourself and your family from that.

## What is offered

An honest, private, traditional conversation about your life and its direction, with an elder who will listen. Money matters also deserve a bank, a savings group, a financial adviser or a business mentor, and traditional consultation replaces none of them.', 'trending-up', '', '["A sense that life or work has stopped moving forward","Weighing an opportunity that has appeared","Questions of direction and what to do next","Personal progress and the setting of goals","A private conversation about pressures carried alone"]'::jsonb, 'No financial gain of any kind is promised or guaranteed. Traditional consultation does not produce money, wealth, luck, employment or business results, and it is never a substitute for professional financial advice.', 11, true, false, 'Personal Progress Consultation | Dr Salongo Hamuza, Uganda', 'Traditional spiritual consultation in Uganda about personal progress, opportunity and life direction. No financial outcome is guaranteed.'),
  ('lost-property-and-theft-concerns', 'Lost Property & Theft Concerns', 'Traditional consultation for people seeking guidance after property has been stolen or lost.', 'The loss of property is not only a financial blow — for many families it is also a loss of security and of trust. Dr Salongo Hamuza offers traditional consultation to people who have suffered theft or loss and who wish to discuss the matter within a traditional framework.', '## What this consultation covers

When something is stolen, the loss is rarely only the thing itself. A family loses the tools it works with, or the animals it depends on, and at the same time loses its sense of safety — particularly when the theft happened close to home.

Dr Salongo Hamuza receives people in that situation and offers traditional consultation about it.

## Please report it to the police

Theft is a crime, and it belongs with the police. A report gives you a case number, creates a record, and is usually required for any insurance claim or replacement. Where property has been taken, the criminal justice system is the proper route, and traditional consultation is not an alternative to it.

## Nobody is to be accused or harmed

This must be stated firmly. No consultation, of any kind, should ever be used to name a person as a thief, or to justify confronting, punishing, shaming or harming anyone.

Accusations made without evidence destroy innocent lives. They tear communities apart and they have, in this country and in others, led to people being attacked and killed over suspicions that turned out to be false. Nothing offered here supports that, and any request pointing in that direction is refused.

If you have evidence, take it to the police. That is the right path, and it is the only one.', 'search', '', '["Property lost or stolen from a home, a shop or a farm","Loss of livestock, tools or equipment needed for a livelihood","The loss of trust that follows a theft close to home","Guidance for a family deciding what to do next","A private conversation for those who feel they have nowhere to turn"]'::jsonb, 'Report theft to the police. Traditional consultation is never a replacement for a criminal investigation, and nobody should ever be named, accused, confronted or harmed on the basis of a consultation. Accusing a person without evidence causes serious injustice and can itself be a criminal offence.', 12, true, false, 'Lost Property & Theft Consultation | Dr Salongo Hamuza, Uganda', 'Traditional consultation in Uganda for people seeking guidance after theft or loss of property. Always report theft to the police.'),
  ('general-traditional-consultation', 'General Traditional Consultation', 'If the matter you are carrying is not listed, you are still welcome to make contact and describe it.', 'Not every concern fits a category. Dr Salongo Hamuza receives people whose situation is not listed on this website and who simply wish to describe what they are carrying and ask whether a traditional consultation would be appropriate.', '## If your concern is not listed

The areas described on this website are the ones people ask about most often. They are not a complete list, and nobody should decide against making contact because their situation does not appear there.

If you are carrying something and you do not know where it belongs, you are welcome to telephone or send a message and describe it. You will be told honestly whether a traditional consultation is appropriate for it, and if it is not, you will be told that too.

## Health-related concerns

Some people arrive asking about health — their own or a relative''s, including long-term conditions and mental health. These are received as traditional consultation, and nothing more is claimed for them.

To be completely clear about what that means: no illness is diagnosed here, no medical treatment is given here, and no cure is claimed for any condition whatsoever. Diabetes, mental-health conditions and every other medical matter require qualified healthcare professionals — a doctor, a clinic, a hospital — and treatment prescribed by them should never be stopped, reduced or delayed.

If you or someone close to you is seriously unwell, or is in danger of harming themselves, please seek medical help immediately. That is the most important guidance on this entire website.

## How to make contact

Telephone or send a WhatsApp message describing your situation in your own words. Consultations are private, and what you say is treated in confidence.', 'sparkles', '', '["Concerns that do not fit any of the listed areas","Situations involving several matters at once","People who are unsure whether to come at all","Those enquiring on behalf of a relative or a friend","Health-related concerns brought by visitors, alongside proper medical care"]'::jsonb, 'Where a concern involves health — physical or mental — it is discussed only as a traditional consultation. No diagnosis is made, no treatment is given, and no cure is claimed for any condition. Qualified medical care should always be sought.', 13, true, true, 'General Traditional Consultation | Dr Salongo Hamuza, Uganda', 'Contact Dr Salongo Hamuza, traditional healer in Uganda, about any concern not listed on the website. Private traditional consultation.')
on conflict (slug) do nothing;

-- Starter blog categories. Delete or rename them from the dashboard.
insert into public.blog_categories (slug, name, description) values
  ('traditional-practice', 'Traditional Practice', 'Writing on traditional healing practice in Uganda.'),
  ('cultural-traditions', 'Cultural Traditions', 'Ugandan cultural traditions, customs and their meaning.'),
  ('family-and-relationships', 'Family & Relationships', 'Guidance on family life and relationships.'),
  ('traditional-herbs', 'Traditional Herbs', 'Traditional plants and items used in practice.'),
  ('community', 'Community', 'Community activities, gatherings and announcements.')
on conflict (slug) do nothing;

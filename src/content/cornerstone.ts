/**
 * The cornerstone pages.
 *
 * These exist because a homepage alone cannot answer the very different things
 * people are actually looking for when they search. Each page is written to be
 * genuinely useful to a person reading it — the search relevance follows from
 * the subject being covered properly, not from repeating a phrase.
 *
 * Two rules held throughout the writing:
 *
 *  1. Nothing is invented. There are no statistics, no legal claims, no
 *     qualifications, no years of experience and no success rates, because none
 *     of those were supplied.
 *  2. Nothing is promised. Traditional practice is described as what it is, the
 *     line to medical care is drawn plainly on every page, and no outcome is
 *     guaranteed anywhere.
 */

export interface CornerstoneSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface CornerstoneFaq {
  question: string;
  answer: string;
}

export interface CornerstonePage {
  slug: string;
  eyebrow: string;
  /** The single H1. */
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: CornerstoneSection[];
  faqs: CornerstoneFaq[];
  /** Services linked at the foot of the page, by slug. */
  relatedServices: string[];
  /** Video shown mid-page, by slug, when it is on the site. */
  video?: string;
  image?: string;
}

/* ------------------------------------------------ traditional healer -- */

export const TRADITIONAL_HEALER_UGANDA: CornerstonePage = {
  slug: 'traditional-healer-uganda',
  eyebrow: 'Traditional healing in Uganda',
  h1: 'Traditional Healer in Uganda',
  seoTitle: 'Traditional Healer in Uganda | Dr Salongo Hamuza',
  seoDescription:
    'What a traditional healer in Uganda does, who comes for consultation, how a consultation works and where the line to medical care is drawn. Consultation with Dr Salongo Hamuza.',
  intro:
    'Traditional healing has been part of life in Uganda for far longer than any of the institutions that surround it today. This page explains what a traditional healer actually does, what happens during a consultation, and — just as importantly — what traditional practice does not claim to do.',
  image: '/images/dr-salongo-hamuza-traditional-healer-uganda.webp',
  video: 'traditional-ceremony-in-the-field',
  sections: [
    {
      heading: 'What a traditional healer does',
      paragraphs: [
        'A traditional healer works within a body of knowledge carried from one generation to the next: an understanding of plants, of ceremony, and of the situations people find themselves in. In Uganda that knowledge is local and specific. It belongs to particular families and particular places, and it is learned over years rather than taken from a book.',
        'In practice the work is less dramatic than the word "healer" sometimes suggests. Most of a traditional healer’s day is spent listening. Someone arrives carrying a situation — a marriage that has gone quiet, a business that will not move, a child who has stopped doing well at school, a journey that keeps falling through — and describes it in their own words. The healer asks questions, and only then is anything suggested.',
        'What follows depends on the person and the matter. It may involve traditional preparations made from plants gathered fresh. It may involve ceremony. Often it involves nothing more than a long conversation and advice on what to do next.',
      ],
    },
    {
      heading: 'Who comes for consultation',
      paragraphs: [
        'People arrive with very ordinary difficulties. The concerns brought to Dr Salongo Hamuza are largely the concerns of everyday life, and visitors come from every part of Uganda and from many different backgrounds and faiths.',
      ],
      points: [
        'Marriages and relationships that have become difficult, distant or uncertain',
        'Households that have lost their peace, or families in long disagreement',
        'Businesses and trades that have stalled, and work that will not come',
        'People hoping for progress in their career, including in uniformed services',
        'Couples carrying the weight of trying to conceive',
        'Children struggling at school, or falling behind for reasons nobody can explain',
        'Travel and documentation that keeps failing at the last step',
        'Property that has gone missing, and thefts that were never resolved',
        'Musicians, performers and entertainers trying to establish themselves',
      ],
    },
    {
      heading: 'How a consultation works',
      paragraphs: [
        'There is no form to complete and nothing to prepare beforehand. The process is deliberately simple, because most people making contact are already carrying enough.',
      ],
      points: [
        'You telephone or send a WhatsApp message and describe, in your own words, what you are carrying.',
        'Dr Salongo Hamuza listens to the situation in full and asks whatever he needs to understand it.',
        'Guidance is given according to traditional practice, and what it involves is explained to you plainly.',
        'The decision is yours. You are free to accept the guidance, to consider it, or to leave it.',
      ],
    },
    {
      heading: 'Where traditional practice ends and medical care begins',
      paragraphs: [
        'This distinction matters more than anything else on this page, and it is stated here rather than buried in a footer.',
        'Traditional and spiritual consultation is rooted in traditional belief and practice. It is not medical diagnosis and it is not medical treatment. It does not replace a doctor, a hospital, a clinic or prescribed medication, and it should never be used as a reason to delay or abandon medical care.',
        'Anyone experiencing a serious physical or mental-health condition should seek qualified healthcare. Where a matter that arrives at a consultation plainly belongs with a doctor, a hospital, the police, a teacher or a lawyer, Dr Salongo Hamuza says so directly. Being told honestly that something is outside traditional practice is a legitimate outcome of a consultation.',
        'No specific result, cure, pregnancy, recovery, promotion or financial gain is promised or guaranteed. Individual experiences differ from person to person.',
      ],
    },
    {
      heading: 'Traditional practice alongside modern healthcare',
      paragraphs: [
        'People sometimes arrive expecting to be asked to choose between traditional practice and a hospital. They are not. The two answer different questions, and treating them as rivals helps nobody.',
        'A hospital diagnoses and treats illness. Traditional consultation deals with the situations, relationships and circumstances a person is carrying, within a cultural framework they already understand. Someone can quite reasonably continue their prescribed treatment and also sit down for a traditional consultation, and many do.',
        'What is never appropriate is stopping medical treatment because of something said in a traditional consultation. That is not asked for here.',
      ],
    },
    {
      heading: 'What to look for in a traditional healer',
      paragraphs: [
        'Anyone can describe themselves as a traditional healer, which is precisely why it is worth knowing what to pay attention to before you travel to see one.',
      ],
      points: [
        'Someone who listens first and does not tell you what your problem is before you have described it',
        'Someone who explains what a consultation will involve, in words you understand, before it begins',
        'Someone who is honest about limits, and who will tell you when a matter belongs with a doctor or the authorities',
        'Someone who makes no guarantees, because no honest practitioner can make them',
        'Someone who will not ask you to do anything unlawful, or anything that would cause harm to another person',
        'Someone whose work you can actually see, rather than only read about',
      ],
    },
    {
      heading: 'Consulting Dr Salongo Hamuza',
      paragraphs: [
        'Dr Salongo Hamuza is a professional traditional healer from Uganda offering traditional and spiritual consultation. He receives people by telephone and by WhatsApp, and visitors are received by arrangement.',
        'Consultations are private. Nothing you describe is published, and no name, photograph or account appears anywhere on this website without permission given first. The videos and photographs published here were shared with the agreement of the people in them.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What does a traditional healer in Uganda actually do?',
      answer:
        'A traditional healer works within knowledge carried down through generations — an understanding of plants, of ceremony and of people’s circumstances. In practice most of the work is listening to a person describe their situation, then giving guidance according to traditional practice. It may involve traditional preparations made from freshly gathered plants, or it may involve nothing more than conversation and advice.',
    },
    {
      question: 'Is traditional healing the same as medical treatment?',
      answer:
        'No. Traditional and spiritual consultation is based on traditional beliefs and practices. It is not medical diagnosis or treatment and does not replace advice from qualified healthcare professionals. Anyone with a serious physical or mental-health condition should seek appropriate medical care, and no one should stop prescribed treatment because of a traditional consultation.',
    },
    {
      question: 'What happens during a first consultation?',
      answer:
        'You describe your situation in your own words, for as long as you need. Dr Salongo Hamuza listens and asks the questions he needs to understand it. Guidance is then offered according to traditional practice and explained to you plainly. You are free to accept it, consider it, or decline it.',
    },
    {
      question: 'Do I need to prepare anything before making contact?',
      answer:
        'No. There is no form to fill in and nothing to bring or prepare. A telephone call or a WhatsApp message describing your situation is enough to begin, and you can decide afterwards whether you wish to come.',
    },
    {
      question: 'Is a consultation private?',
      answer:
        'Yes. What is said in a consultation stays between you and Dr Salongo Hamuza. No name, photograph or account is published on this website without permission being given first.',
    },
    {
      question: 'Are results guaranteed?',
      answer:
        'No, and you should be cautious of anyone who tells you otherwise. Guidance is offered; outcomes are never promised. No specific result, cure, pregnancy, recovery, promotion or financial gain is guaranteed, and individual experiences differ from person to person.',
    },
    {
      question: 'Which parts of Uganda does Dr Salongo Hamuza serve?',
      answer:
        'People make contact from across Uganda, and from outside it. Consultation begins by telephone or WhatsApp, and visitors are received by arrangement. The most direct way to ask is to call {phone}.',
    },
  ],
  relatedServices: [
    'relationship-and-love-matters',
    'family-matters',
    'business-and-career',
    'general-traditional-consultation',
  ],
};

/* ------------------------------------------------ traditional doctor -- */

export const TRADITIONAL_DOCTOR_UGANDA: CornerstonePage = {
  slug: 'traditional-doctor-uganda',
  eyebrow: 'Traditional practice',
  h1: 'Traditional Doctor in Uganda',
  seoTitle: 'Traditional Doctor in Uganda | Dr Salongo Hamuza',
  seoDescription:
    'What people mean by a traditional doctor in Uganda, how traditional herbs and preparations are used, and how traditional practice differs from a medical doctor. Consultation with Dr Salongo Hamuza.',
  intro:
    'Many people in Uganda say "traditional doctor" where others say "traditional healer". This page explains what the term is generally used to mean, what the work involves, and how it differs from the work of a medical doctor — a difference worth being clear about.',
  image: '/images/traditional-herbs-uganda.webp',
  video: 'herbs-and-preparation',
  sections: [
    {
      heading: 'What people mean by a traditional doctor',
      paragraphs: [
        '"Traditional doctor" and "traditional healer" are, for most people using them, the same thing. Both point to someone who works within African traditional practice rather than within clinical medicine. Which phrase someone reaches for usually depends on where they grew up, what language they are translating from, and who taught them the word.',
        'Dr Salongo Hamuza describes himself as a professional traditional healer. He answers to "traditional doctor" as well, because it is what a great many people call the work — but the description he uses for his own practice is traditional and spiritual consultation.',
        'The word "doctor" in this context carries no claim to a medical qualification, and it is not used here to suggest one. It is a term of respect in ordinary Ugandan speech for someone who holds traditional knowledge.',
      ],
    },
    {
      heading: 'Herbs and traditional preparations',
      paragraphs: [
        'Much of the work rests on plants. Leaves, roots and bark are gathered fresh and prepared in the way they have been prepared in this part of Uganda for generations. Which plants are used, and how they are prepared, is knowledge held locally and learned over a long time.',
        'The preparation is not hidden. It happens in the open, in front of whoever has come, and much of the footage published on this website was filmed exactly where that work takes place rather than staged afterwards.',
        'Traditional preparations are part of traditional practice. They are not prescribed medicines, they are not a substitute for prescribed medicines, and nothing prepared in a traditional consultation should be taken as a replacement for treatment a doctor has given you.',
      ],
    },
    {
      heading: 'The matters people bring',
      paragraphs: [
        'People arrive with the difficulties of ordinary life rather than with a list of symptoms. A traditional consultation is usually about a situation — something that has gone wrong, or stalled, or become impossible to explain — rather than about a diagnosis.',
      ],
      points: [
        'Relationships, marriages and matters within a household',
        'Work, trade, and businesses that have stopped moving',
        'Progress in a career, including in uniformed and public service',
        'Fertility and family matters, carried privately and often for years',
        'Children, schooling and concentration',
        'Travel, documents and journeys that keep failing',
        'Property lost or taken, and matters never resolved',
        'Protection of a home, a family or a place of work',
      ],
    },
    {
      heading: 'A traditional doctor is not a medical doctor',
      paragraphs: [
        'This needs saying plainly. A medical doctor is trained, examined and licensed to diagnose and treat illness. A traditional doctor is not, and Dr Salongo Hamuza makes no such claim.',
        'Traditional and spiritual consultation is offered as guidance rooted in traditional belief and practice. It does not diagnose, treat or cure any medical condition. Anyone experiencing a serious physical or mental-health condition should seek qualified medical care, and should continue any treatment a doctor has prescribed.',
        'Where a matter brought to a consultation belongs with a hospital, the police, a school or a lawyer, that is said plainly and without hesitation. No specific outcome, cure or financial gain is promised or guaranteed.',
      ],
    },
    {
      heading: 'What a visitor can expect',
      paragraphs: [
        'Nothing is assumed about you before you have spoken. A consultation begins with you describing the situation in your own words, for as long as you need, and no photograph, name or account is published without your permission.',
        'You will be told what any guidance involves before it begins, in language you understand. You are not asked to leave your own beliefs at the door — people come from many faiths and backgrounds — and you are never asked to do anything unlawful or anything that would cause harm to another person.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Is a traditional doctor the same as a traditional healer?',
      answer:
        'In everyday Ugandan speech the two usually mean the same thing: someone working within African traditional practice rather than clinical medicine. Dr Salongo Hamuza describes his own work as traditional and spiritual consultation, and answers to both terms.',
    },
    {
      question: 'Does "doctor" here mean a medical qualification?',
      answer:
        'No. In this context the word is a term of respect for someone holding traditional knowledge. It carries no claim to a medical degree or licence, and none is claimed anywhere on this website.',
    },
    {
      question: 'What are traditional herbs used for?',
      answer:
        'Leaves, roots and bark are gathered fresh and prepared according to traditional practice as part of a consultation. They are part of a cultural practice, not prescribed medicine, and they are not a substitute for treatment a doctor has given you.',
    },
    {
      question: 'Can I see a traditional doctor and a medical doctor at the same time?',
      answer:
        'Yes, and many people do. They answer different questions. What is never appropriate is stopping prescribed medical treatment because of something said in a traditional consultation — that is not asked of anyone here.',
    },
    {
      question: 'How do I arrange a consultation?',
      answer:
        'Call {phone}, or send a WhatsApp message, and describe your situation in your own words. There is nothing to prepare beforehand, and you can decide afterwards whether you wish to come.',
    },
  ],
  relatedServices: [
    'general-traditional-consultation',
    'fertility-and-family-consultation',
    'business-and-career',
    'travel-matters',
  ],
};

/* ------------------------------------------------------- terminology -- */

export const WITCH_DOCTOR_UGANDA: CornerstonePage = {
  slug: 'witch-doctor-uganda',
  eyebrow: 'Terminology',
  h1: 'Traditional Healers and the Term "Witch Doctor" in Uganda',
  seoTitle: 'Traditional Healers and the Term "Witch Doctor" in Uganda',
  seoDescription:
    'Why people search for "witch doctor in Uganda", where the term came from, and the words Ugandan practitioners use for themselves. Dr Salongo Hamuza describes his practice as traditional and spiritual healing.',
  intro:
    'Some people searching online use terms such as "witch doctor in Uganda" when they are looking for an African traditional or spiritual practitioner. This page explains where that phrase comes from, why many practitioners do not use it, and what words are used instead — because the language people reach for is rarely the language of the people it describes.',
  image: '/images/dr-salongo-hamuza-traditional-practice.webp',
  sections: [
    {
      heading: 'Why people search for this phrase',
      paragraphs: [
        'If you arrived here after searching for a "witch doctor in Uganda", nothing about that search is held against you. It is one of the most common phrases used in English for African traditional practitioners, and most people typing it are simply using the words they have heard.',
        'It is worth knowing, though, that it is not usually the phrase practitioners themselves use, and that it carries a history the words "traditional healer" do not.',
      ],
    },
    {
      heading: 'Where the term came from',
      paragraphs: [
        'The phrase "witch doctor" is an English construction, not a translation of anything a Ugandan practitioner would call themselves. It came into wide use through colonial-era writing about Africa, where it was applied broadly — and usually dismissively — to healers, herbalists, diviners and ceremonial specialists alike, flattening very different roles into one caricature.',
        'That history is why the phrase sits awkwardly today. It tends to carry an implication of superstition or menace that has little to do with what a traditional healer actually spends their time doing, which is mostly listening to people describe ordinary difficulties.',
        'The term also blurs a distinction that matters a great deal in Ugandan communities: the difference between someone who helps people and someone believed to cause harm. Those are not the same thing, and conflating them does real damage to practitioners doing legitimate work.',
      ],
    },
    {
      heading: 'The words practitioners use',
      paragraphs: [
        'Different practitioners describe themselves differently, and the terms are not interchangeable. Among the descriptions in common use:',
      ],
      points: [
        '**Traditional healer** — the most widely used and most widely accepted English term',
        '**Traditional doctor** — common in everyday Ugandan speech, carrying no claim to medical qualification',
        '**Herbalist** — used where the work is chiefly concerned with plants and preparations',
        '**Spiritual healer** or **spiritual practitioner** — used where the work is chiefly ceremonial',
        '**Traditional practitioner** — a broader, more formal term covering the whole field',
      ],
    },
    {
      heading: 'How Dr Salongo Hamuza describes his practice',
      paragraphs: [
        'Dr Salongo Hamuza describes his work as traditional and spiritual healing and consultation, and describes himself as a professional traditional healer from Uganda. That is the terminology used throughout this website.',
        'The phrase appears on this page because people genuinely search for it and deserve a straight answer about what it means — not because it is how the practice is described. You will not find it used as a label elsewhere on this site.',
      ],
    },
    {
      heading: 'What the practice does and does not involve',
      paragraphs: [
        'Given the associations the term carries, it is worth being explicit about what is and is not offered here.',
      ],
      points: [
        'Consultation begins with listening. Nobody is told what their problem is before they have described it.',
        'Guidance is offered according to traditional practice, and what it involves is explained before it begins.',
        'Nothing unlawful is offered, and no request to cause harm to another person is accepted.',
        'Visitors are not asked to leave their own faith or beliefs at the door.',
        'Traditional practice is not medical diagnosis or treatment, and does not replace qualified healthcare.',
        'No cure, pregnancy, recovery, promotion or financial gain is promised or guaranteed.',
      ],
    },
    {
      heading: 'Choosing your words',
      paragraphs: [
        'If you are unsure what to say when you make contact, "traditional healer" or "traditional consultation" will be understood anywhere in Uganda and is the terminology most practitioners prefer. But you do not need the right vocabulary to ask for help. Describing your situation plainly is enough.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Is "witch doctor" an offensive term?',
      answer:
        'Many practitioners consider it inaccurate rather than deliberately offensive. It is a colonial-era English phrase that was applied broadly to healers, herbalists and diviners alike, and it carries associations of superstition that most traditional healers do not accept. "Traditional healer" is the more widely accepted term.',
    },
    {
      question: 'What is the difference between a witch doctor and a traditional healer?',
      answer:
        'In Ugandan communities an important distinction is drawn between someone who helps people and someone believed to cause harm. The English phrase "witch doctor" tends to blur the two. Traditional healers work to help the people who come to them, and Dr Salongo Hamuza accepts no request to cause harm to anyone.',
    },
    {
      question: 'What does Dr Salongo Hamuza call his own practice?',
      answer:
        'Traditional and spiritual healing and consultation. He describes himself as a professional traditional healer from Uganda, and that is the terminology used throughout this website.',
    },
    {
      question: 'What should I say when I make contact?',
      answer:
        'You do not need any particular vocabulary. "Traditional healer" or "traditional consultation" is understood everywhere in Uganda, but simply describing your situation in your own words is enough to begin.',
    },
  ],
  relatedServices: [
    'general-traditional-consultation',
    'church-and-spiritual-matters',
    'family-matters',
  ],
};

export const CORNERSTONE_PAGES: CornerstonePage[] = [
  TRADITIONAL_HEALER_UGANDA,
  TRADITIONAL_DOCTOR_UGANDA,
  WITCH_DOCTOR_UGANDA,
];

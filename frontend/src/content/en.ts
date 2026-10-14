/**
 * English copy. This is the source of truth for the content structure.
 * Add a locale by creating e.g. pt.ts (a DeepPartial of this object) and registering it in i18n/locales.ts.
 * Rule for editors: no client names, contracts, certifications, licences, statistics or years of experience
 * may be added unless they are real and documented.
 */
export type ServiceContent = {
  slug: string;
  path: string;
  navLabel: string;
  title: string;
  kicker: string;
  summary: string;
  intro: string[];
  photo: string;
  photoBrief: string;
  deliverables: string;
  scopeTitle: string;
  scope: { title: string; text: string }[];
  approachTitle: string;
  approach: string[];
  serviceArea: string;
};

const service = (s: ServiceContent) => s;

export const en = {
  site: {
    name: 'Jelson & Wilson Cunha',
    short: 'J&W Cunha',
    descriptor: 'Integrated space management',
    skip: 'Skip to content',
    metaDescription:
      'Jelson & Wilson Cunha — facility management, property management, waste management and products & supplies for oil & gas operators, contractors, logistics bases and industrial projects.',
  },
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    sectors: 'Sectors',
    hse: 'HSE & Quality',
    mobilisation: 'Mobilisation',
    contact: 'Contact',
    cta: 'Request a proposal',
    open: 'Open menu',
    close: 'Close menu',
    primary: 'Primary navigation',
    language: 'Language',
  },
  photoAlt: {
    'home-hero': 'Two technicians in hard hats and uniforms reviewing a tablet outside a modern building',
    about: 'Team of six technicians in hard hats reviewing plans and tablets outside a business centre',
    'facility-management': 'Technician with a tablet inspecting plant room equipment and green-painted pipework',
    'property-management': 'Technician with a tablet inspecting the grounds of a residential building',
    'waste-management': 'Team sorting plastic, paper, metal and glass into colour-coded bins at a waste sorting area',
    'supplies-procurement': 'Technician with a tablet checking stock in a warehouse aisle with labelled shelving and forklifts',
    sectors: 'Worker in a hard hat overlooking a bay with ships, a coastal avenue and a city skyline',
    hse: 'Supervisor briefing a team in front of a safety board reading "Trabalho seguro é trabalho bem feito"',
    mobilisation: 'Crew and a pick-up truck arriving at a port yard with ships in the background',
  } as Record<string, string>,
  home: {
    title: 'Integrated space management',
    kicker: 'Integrated space management',
    headline: 'We care for spaces. We add value to property.',
    lead:
      'Jelson & Wilson Cunha delivers facility management, property management, waste management and products & supplies to oil & gas operators, contractors, logistics bases and industrial projects, as well as to commercial buildings, condominiums, hospitality and institutions.',
    primaryCta: 'Request a proposal',
    secondaryCta: 'See how we mobilise',
    photoBrief: 'Wide exterior of an industrial base or yard at first light, equipment and buildings in view.',
    servicesTitle: 'Four service lines, one accountable team',
    servicesLead:
      'Operators and contractors should not have to coordinate separate vendors for the basics of a working site. We combine the services below under a single point of contact, or deliver each one on its own scope.',
    serviceMore: 'View service',
    audienceTitle: 'Who we work with',
    audienceText:
      'Our services are designed for organisations that run, build or supply industrial and energy operations, where continuity, safety and clear accountability matter more than headline promises.',
    audienceLink: 'Sectors we support',
    engageTitle: 'From enquiry to site in a controlled sequence',
    engageText:
      'Every engagement follows a defined mobilisation path: scope definition, site assessment, proposal, mobilisation plan and start-up. You know what happens next, and who is responsible for it.',
    engageLink: 'Read the mobilisation approach',
    hseTitle: 'Safety and quality are conditions of the work, not an appendix to it.',
    hseText:
      'We plan every service around the client’s HSE requirements, site rules and permit systems. Our proposals state how work will be controlled before they state what it will cost.',
    hseLink: 'HSE & Quality',
  },
  about: {
    title: 'About the company',
    kicker: 'About',
    headline: 'A practical partner for the services behind industrial operations.',
    intro: [
      'Jelson & Wilson Cunha provides the support services that allow oil & gas operations, logistics bases and industrial projects to concentrate on their core work.',
      'We are organised around four service lines — facility management, property management, waste management, and products & supplies — delivered with a consistent management approach and a clear line of accountability.',
    ],
    photoBrief: 'Team members in company-issued PPE reviewing a plan on site (use real staff, with consent).',
    principlesTitle: 'How we work',
    principles: [
      {
        title: 'Defined scope',
        text: 'We agree what is included, what is not, and how performance will be reviewed, before work starts.',
      },
      {
        title: 'Single accountability',
        text: 'Each engagement has a named lead who answers to the client for delivery, reporting and escalation.',
      },
      {
        title: 'Client rules first',
        text: 'We work within the client’s HSE management system, site induction, permit-to-work and access procedures.',
      },
      {
        title: 'Records you can audit',
        text: 'Inspections, deliveries, waste movements and corrective actions are documented and available for review.',
      },
    ],
    scopeTitle: 'What we do',
    scopeText:
      'We do not operate wells, process plants or pipelines. We provide the supporting services around them: the buildings, accommodation, grounds and utilities, the waste streams, and the materials and consumables that sites depend on.',
    ctaTitle: 'Discuss a requirement',
    ctaText: 'Tell us about your site or project and we will respond with a proposed approach.',
  },
  services: {
    index: 'Services',
    deliverablesLabel: 'Deliverables:',
    whatTitle: 'Scope of services',
    approachLabel: 'How we deliver',
    relatedTitle: 'Other services',
    ctaTitle: 'Request a proposal for this service',
    ctaText: 'Describe the site, the scope and the timeline. We will confirm what we need to prepare a proposal.',
    facility: service({
      slug: 'facility-management',
      path: '/services/facility-management',
      navLabel: 'Facility Management',
      title: 'Facility Management',
      kicker: 'Service 01',
      summary:
        'Preventive and corrective maintenance, cleaning, hygiene, gardening and coordination of support services.',
      deliverables: 'plan, work orders and report.',
      intro: [
        'We manage the day-to-day operation of site facilities: offices, workshops, warehouses, accommodation and the services that support them.',
        'Scope is built around the site. Some clients need a full integrated contract; others need a defined package such as cleaning, grounds or planned maintenance.',
      ],
      photo: 'facility-management',
      photoBrief: 'Maintenance technician inspecting building services or a workshop interior on an industrial site.',
      scopeTitle: 'Typical scope',
      scope: [
        { title: 'Planned and reactive maintenance', text: 'Inspection routines, repairs and a logged response to faults across buildings and utilities.' },
        { title: 'Cleaning and hygiene', text: 'Offices, accommodation, ablutions and catering areas, to the standard set for the site.' },
        { title: 'Grounds and general site upkeep', text: 'Access roads, drainage, landscaping and external areas kept safe and passable.' },
        { title: 'Accommodation and camp services', text: 'Housekeeping, laundry and upkeep for permanent and temporary accommodation.' },
        { title: 'Helpdesk and reporting', text: 'A single channel for requests, with recorded status and periodic performance reporting.' },
      ],
      approachTitle: 'How we deliver',
      approach: [
        'Baseline survey of condition, risks and existing maintenance records.',
        'Service schedule and response targets agreed with the client.',
        'Supervised crews working under the client’s permit and induction rules.',
        'Regular review of performance and corrective actions.',
      ],
      serviceArea: 'FACILITY_MANAGEMENT',
    }),
    property: service({
      slug: 'property-management',
      path: '/services/property-management',
      navLabel: 'Property Management',
      title: 'Property Management',
      kicker: 'Service 02',
      summary:
        'Inspections, upkeep, incident management, suppliers and expenses for properties and condominiums.',
      deliverables: 'inventory, incident log and accounts.',
      intro: [
        'Industrial projects often rely on leased land, buildings and housing. We administer these assets on the client’s behalf so that obligations are tracked and conditions are documented.',
        'Our role is administrative and supervisory; specialist works are procured and managed through the same controlled process we use for supplies.',
      ],
      photo: 'property-management',
      photoBrief: 'Exterior of an office or accommodation building at a base, ordered and well kept.',
      scopeTitle: 'Typical scope',
      scope: [
        { title: 'Asset and condition register', text: 'A maintained record of premises, their condition and their documentation.' },
        { title: 'Lease and occupancy administration', text: 'Tracking of terms, renewal dates, payments due and space allocation.' },
        { title: 'Inspections and handover', text: 'Documented entry and exit inspections for premises taken on or returned.' },
        { title: 'Landlord and tenant coordination', text: 'A single point of contact for owners, occupants and neighbouring users.' },
        { title: 'Works coordination', text: 'Scoping, tendering and supervision of repairs and improvements through approved contractors.' },
      ],
      approachTitle: 'How we deliver',
      approach: [
        'Collect and verify the documentation for each asset.',
        'Inspect, photograph and record condition at the start of the engagement.',
        'Maintain a calendar of obligations and inspections.',
        'Report to the client on a fixed schedule and on exceptions.',
      ],
      serviceArea: 'PROPERTY_MANAGEMENT',
    }),
    waste: service({
      slug: 'waste-management',
      path: '/services/waste-management',
      navLabel: 'Waste Management',
      title: 'Waste Management',
      kicker: 'Service 03',
      summary:
        'Diagnosis, segregation, packaging and documented routing with licensed operators.',
      deliverables: 'waste map and proof of destination.',
      intro: [
        'Industrial sites produce a range of waste streams, each with its own handling and disposal requirements. We organise collection and segregation at source and keep the paperwork that proves where the waste went.',
        'Treatment and final disposal are carried out through suitably authorised third-party facilities, selected with and approved by the client.',
      ],
      photo: 'waste-management',
      photoBrief: 'Segregated and labelled waste storage area on a site, containers clearly identified.',
      scopeTitle: 'Typical scope',
      scope: [
        { title: 'Waste audit and segregation plan', text: 'Identification of streams on site and a segregation scheme with labelled containers.' },
        { title: 'Collection and internal handling', text: 'Scheduled collection and safe transfer to a controlled temporary storage area.' },
        { title: 'Storage area management', text: 'Housekeeping, inspection and inventory of the temporary storage area.' },
        { title: 'Transport and disposal coordination', text: 'Arrangement of authorised carriers and facilities, with manifests and certificates retained.' },
        { title: 'Waste records and reporting', text: 'A register of quantities by stream and destination, available for client audits.' },
      ],
      approachTitle: 'How we deliver',
      approach: [
        'Characterise waste streams and confirm the applicable requirements with the client.',
        'Train site personnel on segregation and container use.',
        'Track every movement from source to final destination.',
        'Review volumes and propose reduction and reuse opportunities.',
      ],
      serviceArea: 'WASTE_MANAGEMENT',
    }),
    supplies: service({
      slug: 'supplies-procurement',
      path: '/services/supplies-procurement',
      navLabel: 'Products & Supplies',
      title: 'Products & Supplies',
      kicker: 'Service 04',
      summary:
        'Cleaning products, consumables, PPE, containers, tools and parts, according to specification and availability.',
      deliverables: 'checked supply and technical documentation.',
      intro: [
        'Reliable supply is a matter of specification, sourcing discipline and follow-up. We act as a procurement desk for the client, from request to receipt on site.',
        'We purchase against written requirements and report on status, so the client sees what has been ordered, what has shipped and what is late.',
      ],
      photo: 'supplies-procurement',
      photoBrief: 'Warehouse or laydown area with stored materials, racking and a goods-in check under way.',
      scopeTitle: 'Typical scope',
      scope: [
        { title: 'Requisition handling', text: 'Clarification of specifications and quantities with the requesting department.' },
        { title: 'Sourcing and comparison', text: 'Enquiries to suitable suppliers and comparison of offers on a consistent basis.' },
        { title: 'Purchase and expediting', text: 'Order placement and follow-up with suppliers until delivery.' },
        { title: 'Receiving and inspection', text: 'Checks on arrival against order and specification, with discrepancies recorded.' },
        { title: 'Stock and consumables replenishment', text: 'Minimum levels agreed with the client and replenishment on a regular cycle.' },
      ],
      approachTitle: 'How we deliver',
      approach: [
        'Agree approval limits and documentation with the client.',
        'Maintain a request-to-delivery log visible to the client.',
        'Apply the client’s supplier qualification requirements where they exist.',
        'Report on delivery performance and open items.',
      ],
      serviceArea: 'SUPPLIES_PROCUREMENT',
    }),
  },
  sectors: {
    title: 'Sectors of activity',
    kicker: 'Sectors',
    headline: 'Built for the environments where continuity and control matter.',
    intro:
      'We support organisations across the oil & gas value chain and the industrial projects around it. Each environment has its own rules; we adapt our services to them rather than the reverse.',
    photoBrief: 'Industrial skyline or yard: tanks, pipework and cranes, taken at a respectful distance.',
    list: [
      {
        title: 'Oil & gas operators',
        text: 'Operators need dependable support to their bases, offices and accommodation, run to their own HSE and contracting standards.',
      },
      {
        title: 'Contractors and subcontractors',
        text: 'Contractors on construction, maintenance and shutdown scopes need facilities, supplies and waste arrangements in place before crews arrive.',
      },
      {
        title: 'Logistics and supply bases',
        text: 'Bases handling materials, equipment and personnel require well-kept yards and buildings, and a steady flow of consumables.',
      },
      {
        title: 'Industrial projects',
        text: 'Temporary and long-term project sites benefit from a single party coordinating the services that surround the main works.',
      },
      {
        title: 'Commercial buildings, condominiums, hospitality and institutions',
        text: 'The same integrated approach applies to offices, commercial buildings, condominiums, hotels and institutions that need their premises, assets and supplies managed under a single plan.',
      },
    ],
    noteTitle: 'Where we do not operate',
    note:
      'We do not perform drilling, well services, process operation or specialist engineering. When a requirement lies outside our scope we will say so.',
  },
  hse: {
    title: 'HSE & Quality',
    kicker: 'HSE & Quality',
    headline: 'Work is planned and controlled before it starts.',
    intro:
      'In oil & gas, how a task is controlled matters as much as the task itself. Our approach to health, safety, environment and quality is set out below as the way we plan to work; project-specific plans are issued with each proposal.',
    photoBrief: 'Worker in full PPE at a permit-controlled work location; no staged or stock “hard hat” imagery.',
    pillarsTitle: 'Our approach',
    pillars: [
      {
        title: 'Align with the client system',
        text: 'We adopt the client’s HSE management system, site induction, permit-to-work, lifting and access rules on every site.',
      },
      {
        title: 'Plan the task',
        text: 'Each service is supported by documented method statements and risk assessments for its main activities.',
      },
      {
        title: 'Competent people',
        text: 'Personnel are assigned according to the task and receive the required inductions and instruction before starting.',
      },
      {
        title: 'Report and correct',
        text: 'Incidents, near misses and observations are reported promptly, investigated in proportion and closed out with actions.',
      },
      {
        title: 'Protect the environment',
        text: 'We prevent spills, segregate waste and keep records so environmental obligations can be demonstrated.',
      },
      {
        title: 'Check the quality',
        text: 'Service levels are agreed up front, inspected on a routine basis and reviewed with the client.',
      },
    ],
    docsTitle: 'Documentation',
    docsText:
      'HSE plans, method statements and the documentation required for client prequalification are prepared for each opportunity. Tell us what your prequalification process requires when you request a proposal.',
    ctaTitle: 'Share your HSE requirements',
    ctaText: 'Include your standards and prequalification needs in your enquiry.',
  },
  mobilisation: {
    title: 'Mobilisation',
    kicker: 'Mobilisation',
    headline: 'A defined path from first enquiry to a working site.',
    intro:
      'Speed matters, but only if it is controlled. Our mobilisation sequence is designed to get people, materials and procedures in place without skipping the steps that protect the client.',
    photoBrief: 'Vehicles and crew arriving at a site gate or a laydown area being prepared.',
    stepsTitle: 'Mobilisation sequence',
    steps: [
      { title: 'Enquiry and scope definition', text: 'We confirm location, services, duration, standards and constraints.' },
      { title: 'Site assessment', text: 'Where required, we visit the site or review its documentation to identify risks and requirements.' },
      { title: 'Proposal', text: 'You receive a written proposal covering scope, resources, HSE approach, assumptions and commercial terms.' },
      { title: 'Mobilisation plan', text: 'Following acceptance we agree the schedule, personnel, equipment, inductions and communication lines.' },
      { title: 'Start-up and verification', text: 'Services start under supervision, and early performance is checked against what was agreed.' },
      { title: 'Steady state and review', text: 'We report on a fixed cycle and review scope and performance with the client.' },
    ],
    inputsTitle: 'What helps us mobilise faster',
    inputs: [
      'Location and access conditions',
      'Services required and expected duration',
      'Applicable HSE and contracting standards',
      'Prequalification and documentation requirements',
      'Target start date and key contacts',
    ],
    ctaTitle: 'Start with an enquiry',
    ctaText: 'The more precisely you describe the requirement, the sooner we can propose how to deliver it.',
  },
  contact: {
    title: 'Contact & request a proposal',
    kicker: 'Contact',
    headline: 'Tell us about your site or project.',
    intro:
      'Use the form to request a proposal or ask a question. Your request is stored securely and reviewed by our team. Please do not include confidential commercial documents in this form.',
    detailsTitle: 'Company details',
    email: 'Email',
    address: 'Address',
    form: {
      title: 'Proposal request',
      fullName: 'Full name',
      company: 'Company',
      email: 'Work email',
      phone: 'Phone (optional)',
      serviceArea: 'Service of interest',
      serviceAreaPlaceholder: 'Select a service',
      projectLocation: 'Site or project location (optional)',
      message: 'Describe the requirement',
      messageHint: 'Scope, duration, standards and target start date, where known. Minimum 20 characters.',
      consent:
        'I agree that Jelson & Wilson Cunha may store and use these details to respond to my request.',
      submit: 'Send request',
      sending: 'Sending…',
      successTitle: 'Request received',
      successText: 'Your request has been saved. Please quote this reference if you contact us:',
      another: 'Send another request',
      errorSummary: 'Please correct the highlighted fields.',
      errorServer: 'Your request could not be saved. Nothing was sent; please try again in a few minutes.',
      errorRate: 'Too many submissions from your connection. Please try again later.',
      errorNetwork: 'We could not reach the server. Nothing was sent; please check your connection and try again.',
      services: {
        FACILITY_MANAGEMENT: 'Facility Management',
        PROPERTY_MANAGEMENT: 'Property Management',
        WASTE_MANAGEMENT: 'Waste Management',
        SUPPLIES_PROCUREMENT: 'Products & Supplies',
        MOBILISATION: 'Mobilisation',
        OTHER: 'Other / not sure',
      } as Record<string, string>,
      errors: {
        fullName: 'Enter your full name.',
        company: 'Enter your company name.',
        email: 'Enter a valid email address.',
        phone: 'Phone may contain only digits, spaces and + ( ) - .',
        serviceArea: 'Select a service.',
        message: 'Please describe your requirement (at least 20 characters).',
        consent: 'Consent is required to process your request.',
      },
    },
  },
  admin: {
    title: 'Proposal requests',
    kicker: 'Administration',
    login: {
      intro: 'Restricted area. Sign in with the administrator account.',
      username: 'Username',
      password: 'Password',
      submit: 'Sign in',
      signingIn: 'Signing in…',
      wrong: 'Incorrect username or password.',
      throttled: 'Too many failed attempts. Try again in a few minutes.',
      network: 'Could not reach the server. Try again.',
      logout: 'Sign out',
    },
    summaryLabel: 'Requests by status',
    statuses: { NEW: 'New', IN_REVIEW: 'In review', RESPONDED: 'Responded', CLOSED: 'Closed' } as Record<string, string>,
    alerts: {
      SENT: 'E-mail alert sent',
      FAILED: 'E-mail alert failed',
      PENDING: 'E-mail alert pending',
      DISABLED: 'No e-mail alert',
    } as Record<string, string>,
    filters: {
      search: 'Search',
      searchPlaceholder: 'Name, company, e-mail, message…',
      status: 'Status',
      allStatuses: 'All statuses',
      service: 'Service',
      allServices: 'All services',
      clear: 'Clear filters',
    },
    columns: { received: 'Received', company: 'Company', contact: 'Contact', service: 'Service', status: 'Status' },
    empty: 'No requests match these filters.',
    loading: 'Loading…',
    loadError: 'Could not load the requests.',
    saveError: 'Could not change the status. Nothing was changed.',
    statusSaved: 'Status updated.',
    open: 'Open',
    close: 'Close',
    detail: {
      message: 'Message',
      location: 'Project location',
      phone: 'Phone',
      language: 'Language',
      reference: 'Reference',
      reply: 'Reply by e-mail',
      alert: 'E-mail alert',
    },
    notes: {
      title: 'Internal notes',
      hint: 'Visible only to the team. Record who contacted the client, when and what was agreed.',
      empty: 'No notes yet.',
      label: 'New note',
      placeholder: 'E.g. Called the client; they asked for a site visit next week.',
      add: 'Add note',
      adding: 'Saving…',
      by: 'by',
      delete: 'Delete',
      confirmDelete: 'Confirm deletion',
      cancel: 'Cancel',
      loadError: 'Could not load the notes.',
      saveError: 'Could not save the note. Nothing was saved.',
      deleteError: 'Could not delete the note. Nothing was changed.',
      badgeOne: 'note',
      badgeMany: 'notes',
    },
    export: 'Export CSV',
    exporting: 'Preparing…',
    exportError: 'Could not export the requests.',
    exportNote: 'CSV with the current filters (up to 5000 rows), semicolon-separated for Excel.',
    pagination: { previous: 'Previous', next: 'Next', page: 'Page', of: 'of', total: 'requests' },
  },
  notFound: {
    title: 'Page not found',
    headline: 'This page does not exist.',
    text: 'The address may be wrong or the page may have moved.',
    home: 'Return to the home page',
  },
  footer: {
    tagline: 'Integrated space management.',
    scopeNote: 'Specialised scope subject to the applicable licences. Visits by appointment.',
    servicesTitle: 'Services',
    companyTitle: 'Company',
    contactTitle: 'Contact',
    rights: 'All rights reserved.',
    privacy:
      'Information submitted through the contact form is used only to respond to your request.',
  },
};

export type Content = typeof en;

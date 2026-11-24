/** Default page parameters — mirror of docs/statsig-params.yml */
export type PageId =
  | "home"
  | "article"
  | "search"
  | "topic"
  | "author"
  | "account_register"
  | "account_login"
  | "account"
  | "subscribe"
  | "checkout"
  | "checkout_confirmation"
  | "not_found"
  | "shell"
  | "discovery_chat";

export const PAGE_LAYER_NAMES: Record<PageId, string> = {
  home: "home_layer",
  article: "article_layer",
  search: "search_layer",
  topic: "topic_layer",
  author: "author_layer",
  account_register: "account_register_layer",
  account_login: "account_login_layer",
  account: "account_layer",
  subscribe: "subscribe_layer",
  checkout: "checkout_layer",
  checkout_confirmation: "checkout_confirmation_layer",
  not_found: "not_found_layer",
  shell: "shell_layer",
  discovery_chat: "discovery_chat_layer",
};

export const PAGE_STORE_NAMES: Record<PageId, string> = {
  home: "home_params",
  article: "article_params",
  search: "search_params",
  topic: "topic_params",
  author: "author_params",
  account_register: "account_register_params",
  account_login: "account_login_params",
  account: "account_params",
  subscribe: "subscribe_params",
  checkout: "checkout_params",
  checkout_confirmation: "checkout_confirmation_params",
  not_found: "not_found_params",
  shell: "shell_params",
  discovery_chat: "discovery_chat_params",
};

export type ParamPrimitive = string | number | boolean;
export type ParamValue = ParamPrimitive | Record<string, unknown> | unknown[];

export const PAGE_DEFAULTS = {
  home: {
    tab_labels: {
      top: "Top Stories",
      "product-analytics": "Product Analytics",
      experimentation: "Experimentation",
      podcasts: "Podcasts",
    },
    default_tab: "top",
    feed_item_limit: 8,
    latest_list_limit: 6,
    secondary_lead_count: 3,
    feed_empty_message: "No stories in this section yet.",
    topics_heading: "Topics",
    podcast_spotlight_label: "Podcast",
    newsletter_title: "The Daily Briefing",
    newsletter_subcopy: "Simulated newsletter signup — no email is sent.",
    newsletter_email_label: "Work email",
    newsletter_placeholder: "you@company.com",
    newsletter_submit_label: "Sign up",
    newsletter_success_message: "Simulated signup — no email sent",
    sponsored_module_title: "Sponsored insight",
    sponsored_disclosure: "Paid post · Simulated sponsor",
    sponsored_cta_label: "Read the partner briefing",
    latest_rail_heading: "Latest",
    editors_picks_rail_heading: "Editor's picks",
    home_recommendation_variant: "control" as string,
    retention_title: "Simulated renewal reminder",
    retention_body:
      "We noticed lighter reading lately — here's an introductory-style offer if you resubscribe.",
    retention_cta_text: "View simulated introductory offers",
    retention_articles_read_max: 3,
    retention_days_since_visit_min: 7,
  },
  article: {
    not_found_title: "Article not found",
    not_found_body: "This article is not in the demo corpus.",
    return_home_label: "Return home",
    default_preview_paragraphs: 2,
    premium_paywall_scroll_enabled: false,
    paywall_scroll_threshold_px: 48,
    paywall_message_logged_out:
      "Simulated paywall — register or log in, then subscribe to read this premium brief.",
    paywall_message_subscribe_control:
      "Simulated paywall — choose a plan and complete simulated checkout to unlock.",
    paywall_message_subscribe_urgency:
      "Limited-time reader offer — unlock premium briefs now to keep your experiment evaluation streak.",
    paywall_message_canceled: "Simulated paywall — subscription canceled; resubscribe to regain access.",
    paywall_message_expired:
      "Simulated paywall — subscription expired. Renew on Account or advance demo time.",
    paywall_login_label: "Log in",
    paywall_subscribe_label: "Subscribe",
    narrated_section_label: "Listen to this article",
    save_article_label: "Save article",
    saved_article_label: "Saved",
    premium_badge_subscriber: "Premium · subscriber access",
    premium_badge_preview: "Premium · preview",
    recommendations_heading: "More for you",
    article_end_signoff: "You've reached the end of this article.",
  },
  search: {
    empty_query_title: "Search Amplitude Daily",
    empty_query_guidance:
      "Enter a headline or keyword in the header search field to see matching articles.",
    results_title_prefix: "Search results for",
    no_results_template: 'No articles match … Try another keyword such as "retention" or "experiment".',
    empty_results_title: "Search results",
  },
  topic: {
    not_found_title: "Topic not found",
    not_found_body: "No articles are tagged with this topic.",
    return_home_label: "Return home",
  },
  author: {
    not_found_title: "Author not found",
    not_found_body: "No articles are attributed to this author.",
    return_home_label: "Return home",
    follow_button_label: "Follow writer",
    following_button_label: "Following",
  },
  account_register: {
    page_title: "Create account",
    simulation_disclosure:
      "Simulated registration — your typed email becomes the analytics user id. Password is cosmetic only.",
    display_name_label: "Display name",
    default_display_name: "Demo Reader",
    email_label: "Email",
    default_email: "reader-demo@ampliyorker.test",
    password_label: "Password (demo)",
    password_hint:
      "Any non-empty password works. Preset emails map to demo engagement profiles (e.g. lapsed@ampliyorker.test).",
    submit_label: "Create account",
    login_prompt: "Already registered?",
    login_link_label: "Log in",
  },
  account_login: {
    page_title: "Log in",
    simulation_disclosure:
      "Simulated sign-in — analytics identity is your email. Password is cosmetic (try demo or any non-empty value).",
    email_label: "Email",
    password_label: "Password (demo)",
    password_hint: "",
    submit_label: "Continue",
    register_prompt: "New here?",
    register_link_label: "Create account",
  },
  account: {
    gate_title: "Account",
    gate_copy: "Sign in to manage your subscription and saved stories.",
    dashboard_title: "Your account",
    signed_in_template: "Signed in as {name}.",
    subscribe_primary_cta: "Subscribe",
    logout_label: "Log out",
    retention_title: "Simulated renewal reminder",
    retention_body:
      "We noticed lighter reading lately — here's an introductory-style offer if you resubscribe.",
    retention_subscribe_link: "View subscription options",
    billing_section_title: "Billing profile",
    plan_section_title: "Change plan",
    cancel_summary: "Cancel subscription",
    devices_summary: "Device & export",
    demo_controls_summary: "Demo controls (simulated)",
    retention_treatment_variant: "control" as string,
  },
  subscribe: {
    gate_title: "Subscribe",
    gate_copy: "Choose a subscription after you sign in.",
    page_title: "Choose your subscription",
    page_deck: "Unlimited access to every story, briefing, and field note in Amplitude Daily.",
    recommended_plan_badge: "Recommended",
    intro_offer_badge_prefix: "Statsig treatment · ",
    intro_cta_label: "Start with introductory offer",
    standard_cta_label: "Continue at standard price",
    subscription_offer_variant: "control" as string,
    recommended_plan_id: "annual",
  },
  checkout: {
    missing_state_title: "Checkout",
    missing_state_body: "Select a plan on Subscribe first.",
    page_title: "Simulated checkout",
    simulation_disclosure: "Simulated payment — preset values only; nothing is charged.",
    preset_cardholder_name: "Demo Reader",
    preset_card_number: "4242 4242 4242 4242",
    preset_card_expiry: "12/30",
    submit_label: "Submit simulated payment",
    trial_days_on_intro: 7,
  },
  checkout_confirmation: {
    page_title: "Simulated confirmation",
    simulation_disclosure:
      "Simulated payment succeeded — subscription stored in local browser state only.",
    active_subscriber_template: "Active subscriber",
    intro_applied_note: "Introductory offer applied (simulated).",
    premium_article_link_label: "Open premium article",
    account_hub_link_label: "Account hub",
    inactive_body: "No active subscription in local state. Complete checkout from Subscribe.",
  },
  not_found: {
    page_title: "Page not found",
    body_copy: "That hash route is not implemented yet.",
    home_link_label: "Go to Amplitude Daily home",
  },
  shell: {
    skip_link_label: "Skip to main content",
    site_name: "Amplitude Daily",
    masthead_tagline: "Independent reporting on product analytics and experimentation",
    edition_label_prefix: "Today's edition ·",
    promo_band_copy: "Subscribe for full access to Amplitude Daily — plans from $12/month.",
    promo_band_cta: "Subscribe",
    newsletter_utility_link: "Newsletter",
    search_placeholder: "Search headlines…",
    search_submit_label: "Search",
    section_nav_links: [
      { href: "#/", label: "Home" },
      { href: "#/topic/product-analytics", label: "Product Analytics" },
      { href: "#/topic/experimentation", label: "Experimentation" },
      { href: "#/topic/podcast", label: "Podcasts" },
      { href: "#/subscribe", label: "Subscribe" },
    ],
    footer_disclosure:
      "© {year} Amplitude Daily · Fictional demo publication · Simulated accounts, payments, and advertising",
  },
  discovery_chat: {
    panel_title: "Ask the Daily",
    panel_subtitle: "How can we help you explore the demo?",
    disclosure: "",
    suggested_prompts: ["Search tips", "Premium access", "Newsletter signup", "Sponsored content"],
    input_placeholder: "What should I read about retention?",
  },
} as const;

export type PageParamsMap = typeof PAGE_DEFAULTS;

/** Param keys per page — used by YAML parity test */
export const PAGE_PARAM_REGISTRY: Record<PageId, readonly string[]> = Object.fromEntries(
  (Object.keys(PAGE_DEFAULTS) as PageId[]).map((page) => [
    page,
    Object.freeze(Object.keys(PAGE_DEFAULTS[page])),
  ]),
) as Record<PageId, readonly string[]>;
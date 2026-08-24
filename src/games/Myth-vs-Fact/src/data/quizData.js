const ALL_QUESTIONS = [
    // Anxiety
    { id: 101, category: "Anxiety", question: "Anxiety Disorder involves persistent and uncontrollable worry for at least 6 months.", type: "myth_fact", answer: "Fact", explanation: "True. While everyone worries occasionally, a clinical disorder is persistent and impacts daily life." },
    { id: 102, category: "Anxiety", question: "Anyone that worries has an anxiety disorder.", type: "myth_fact", answer: "Myth", explanation: "Worry is a normal human emotion. A disorder involves persistent, uncontrollable worry." },
    { id: 103, category: "Anxiety", question: "Anxiety is a problem mostly for adults.", type: "myth_fact", answer: "Myth", explanation: "Anxiety affects children and adults alike, causing behavioural, emotional, and physical symptoms." },
    { id: 104, category: "Anxiety", question: "Social anxiety is the exact same thing as being shy.", type: "myth_fact", answer: "Myth", explanation: "An introvert may just be shy, but social anxiety can be highly debilitating and isolating." },
    { id: 105, category: "Anxiety", question: "In order to stop feeling anxious, you should suppress your anxious thoughts.", type: "myth_fact", answer: "Myth", explanation: "Hiding emotions only makes anxiety worse and it may come back stronger." },
    { id: 106, category: "Anxiety", question: "Medication is the only effective treatment for anxiety.", type: "myth_fact", answer: "Myth", explanation: "Psychotherapy, lifestyle changes, and CBT are also highly effective treatments." },
    { id: 107, category: "Anxiety", question: "Fainting during panic attacks is actually quite rare.", type: "myth_fact", answer: "Fact", explanation: "Despite the intense physical feeling that you might pass out, fainting is uncommon during panic attacks." },
    // Loneliness
    { id: 108, category: "Loneliness", question: "If you're in a relationship, you can't feel lonely.", type: "myth_fact", answer: "Myth", explanation: "Many people feel lonely even within relationships when emotional closeness is missing." },
    { id: 109, category: "Loneliness", question: "Loneliness and being alone are two entirely different things.", type: "myth_fact", answer: "Fact", explanation: "Loneliness is feeling unseen and disconnected, while being alone can be a peaceful, restorative choice." },
    { id: 110, category: "Loneliness", question: "Social media prevents loneliness.", type: "myth_fact", answer: "Myth", explanation: "Online interactions can feel superficial; digital contact alone may fail to provide true emotional fulfillment." },
    { id: 111, category: "Loneliness", question: "Extroverts don't get lonely.", type: "myth_fact", answer: "Myth", explanation: "Anyone—introvert or extrovert—can feel lonely if their emotional needs aren't met." },
    { id: 112, category: "Loneliness", question: "Even people with many friends can experience deep loneliness.", type: "myth_fact", answer: "Fact", explanation: "True. You can feel very lonely if you don't feel truly understood or supported by those friends." },
    // Anger
    { id: 201, category: "Anger", question: "Research shows men and women experience anger equally often.", type: "myth_fact", answer: "Fact", explanation: "They just express it differently, often influenced heavily by societal and cultural norms." },
    { id: 202, category: "Anger", question: "Men are naturally angrier than women.", type: "myth_fact", answer: "Myth", explanation: "Both experience anger equally, though societal norms often dictate how it is outwardly expressed." },
    { id: 203, category: "Anger", question: "Anger is a universal emotion that affects absolutely everyone.", type: "myth_fact", answer: "Fact", explanation: "It affects everyone regardless of age, background, or social status. It's a completely normal human emotion." },
    { id: 204, category: "Anger", question: "You can't control anger—it's completely uncontrollable.", type: "myth_fact", answer: "Myth", explanation: "While you may not control the initial feeling, you have choices over how you respond to it." },
    { id: 205, category: "Anger", question: "Suppressing your anger means you're strong.", type: "myth_fact", answer: "Myth", explanation: "Suppressing anger can be harmful, leading to stress, health issues, or explosive outbursts later." },
    { id: 206, category: "Anger", question: "Venting or 'blowing off steam' reduces anger.", type: "myth_fact", answer: "Myth", explanation: "Venting often reinforces anger. Calming techniques like deep breathing are much more effective." },
    // Burnout
    { id: 207, category: "Burnout", question: "Signs of burnout at work can vary widely from person to person.", type: "myth_fact", answer: "Fact", explanation: "Some become irritable, while others might feel overwhelmed even without a change in their workload." },
    { id: 208, category: "Burnout", question: "Burnout only happens in the workplace.", type: "myth_fact", answer: "Myth", explanation: "Burnout happens in all areas of life—personal and professional—where there is chronic, unmanaged stress." },
    { id: 209, category: "Burnout", question: "If you love your job, you cannot burn out.", type: "myth_fact", answer: "Myth", explanation: "Passion can actually increase the risk if it leads to overworking and difficulty setting boundaries." },
    { id: 210, category: "Burnout", question: "A vacation will completely fix your burnout.", type: "myth_fact", answer: "Myth", explanation: "Rest alone will not heal burnout unless you address the root cause of the chronic stress." },
    { id: 211, category: "Burnout", question: "Highly engaged, enthusiastic employees are often the ones most likely to burn out.", type: "myth_fact", answer: "Fact", explanation: "Their high energy and intense focus can lead to overworking, poor boundaries, and eventually exhaustion." },
    { id: 212, category: "Burnout", question: "Burnout and stress are the exact same thing.", type: "myth_fact", answer: "Myth", explanation: "Burnout is a specific result of extended periods of unmanaged or chronic stress, not the stress itself." },
    // Depression
    { id: 301, category: "Depression", question: "Depression is a medical disorder that alters your brain chemistry.", type: "myth_fact", answer: "Fact", explanation: "It is negatively affected by environmental or biological factors, and is not just temporary 'sadness'." },
    { id: 302, category: "Depression", question: "Being sad and being depressed are the exact same thing.", type: "myth_fact", answer: "Myth", explanation: "Sadness is a temporary emotion; depression is a serious medical disorder affecting brain chemistry." },
    { id: 303, category: "Depression", question: "Only traumatic events can cause depression.", type: "myth_fact", answer: "Myth", explanation: "Depression is influenced by genetics, brain chemistry, stress, and physical health—not just trauma." },
    { id: 304, category: "Depression", question: "If life is good and you have it all, you can't be depressed.", type: "myth_fact", answer: "Myth", explanation: "Depression doesn't discriminate based on life circumstances; it can affect absolutely anyone." },
    { id: 305, category: "Depression", question: "Depression manifests differently; some withdraw, while others appear outwardly happy.", type: "myth_fact", answer: "Fact", explanation: "True. Some people mask their symptoms entirely and appear totally 'put together' to the outside world." },
    { id: 306, category: "Depression", question: "Depression is a sign of laziness and you can simply 'snap out of it'.", type: "myth_fact", answer: "Myth", explanation: "It is a serious medical condition where nerve circuits regulating mood function abnormally." },
    // Suicide
    { id: 307, category: "Suicide", question: "Always take suicidal expressions seriously—they are often a plea for help.", type: "myth_fact", answer: "Fact", explanation: "Your time, attention, or a referral to a professional could save a person's life." },
    { id: 308, category: "Suicide", question: "People who say they have thoughts of suicide are only seeking attention.", type: "myth_fact", answer: "Myth", explanation: "They are seeking help. Take every expression or threat seriously." },
    { id: 309, category: "Suicide", question: "Talking about suicide will put the idea in their head and encourage attempts.", type: "myth_fact", answer: "Myth", explanation: "Talking about it opens communication, eases fears, and is often the first step toward healing." },
    { id: 310, category: "Suicide", question: "Young people who talk about suicide never actually attempt it.", type: "myth_fact", answer: "Myth", explanation: "Talking can be a direct request for help or a strong warning sign for a later attempt." },
    { id: 311, category: "Suicide", question: "Suicide risk can actually increase as a person's severe depression starts to lift.", type: "myth_fact", answer: "Fact", explanation: "Rising motivation and returning energy may unfortunately turn suicidal thoughts into actions." },
    { id: 312, category: "Suicide", question: "People who take their own lives are selfish, cowardly, or weak.", type: "myth_fact", answer: "Myth", explanation: "They are often experiencing unbearable emotional pain and find it difficult to see any other way out." }
];

export const QUIZ_LEVELS = [
    {
        id: 1,
        title: "Level 1 ",
        description: "A balanced mix of all mental health topics.",
        timeLimit: 90,
        questions: ALL_QUESTIONS
    },
    {
        id: 2,
        title: "Level 2 ",
        description: "Rapid fire round across all topics.",
        timeLimit: 60,
        questions: ALL_QUESTIONS
    },
    {
        id: 3,
        title: "Level 3",
        description: "Extreme speed! Trust your instincts.",
        timeLimit: 30,
        questions: ALL_QUESTIONS
    }
];

/**
 * Mock data generators for different topics.
 * Each generator returns { tree, crossRefs } for the given keyword.
 *
 * Node shape:
 *   { id, label, type, year, description, url, branch, children? }
 *
 * Types: 'discipline' | 'paper' | 'software' | 'event' | 'milestone' | 'concept'
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AI History — the default showcase dataset
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function generateAIHistory() {
  const tree = {
    id: 'ai-root',
    label: 'Artificial Intelligence',
    type: 'discipline',
    year: 1956,
    description: 'The field of AI was formally founded at the Dartmouth Conference in 1956, where John McCarthy coined the term.',
    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    branch: 'root',
    children: [
      // ── Neural Networks Branch ──────────────────────────────
      {
        id: 'nn',
        label: 'Neural Networks',
        type: 'concept',
        year: 1943,
        description: 'Computational models inspired by biological neural networks.',
        url: 'https://en.wikipedia.org/wiki/Artificial_neural_network',
        branch: 'neural-networks',
        children: [
          {
            id: 'mcp-neuron',
            label: 'McCulloch–Pitts Neuron',
            type: 'paper',
            year: 1943,
            description: 'Warren McCulloch and Walter Pitts published "A Logical Calculus of Ideas Immanent in Nervous Activity" — the first mathematical model of a neural network.',
            url: 'https://doi.org/10.1007/BF02478259',
            branch: 'neural-networks',
            children: [],
          },
          {
            id: 'perceptron',
            label: 'Perceptron',
            type: 'paper',
            year: 1957,
            description: 'Frank Rosenblatt invented the Perceptron — the first trainable neural network, implemented in hardware as the Mark I.',
            url: 'https://en.wikipedia.org/wiki/Perceptron',
            branch: 'neural-networks',
            children: [],
          },
          {
            id: 'backprop',
            label: 'Backpropagation',
            type: 'paper',
            year: 1986,
            description: 'Rumelhart, Hinton & Williams popularized backpropagation for training multi-layer networks, reigniting neural network research.',
            url: 'https://doi.org/10.1038/323533a0',
            branch: 'neural-networks',
            children: [
              {
                id: 'lenet',
                label: 'LeNet-5',
                type: 'paper',
                year: 1998,
                description: 'Yann LeCun introduced convolutional neural networks for handwritten digit recognition, deployed by USPS.',
                url: 'http://yann.lecun.com/exdb/lenet/',
                branch: 'neural-networks',
                children: [],
              },
            ],
          },
          {
            id: 'deep-learning',
            label: 'Deep Learning Revival',
            type: 'milestone',
            year: 2006,
            description: 'Geoffrey Hinton showed that deep networks can be effectively trained using layer-wise pretraining, sparking the deep learning revolution.',
            url: 'https://doi.org/10.1162/neco.2006.18.7.1527',
            branch: 'neural-networks',
            children: [
              {
                id: 'alexnet',
                label: 'AlexNet',
                type: 'paper',
                year: 2012,
                description: 'Krizhevsky, Sutskever & Hinton won ImageNet with a deep CNN, triggering the modern deep learning era.',
                url: 'https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
                branch: 'neural-networks',
                children: [],
              },
              {
                id: 'resnet',
                label: 'ResNet',
                type: 'paper',
                year: 2015,
                description: 'He et al. introduced residual connections enabling training of 152+ layer networks, winning ImageNet 2015.',
                url: 'https://arxiv.org/abs/1512.03385',
                branch: 'neural-networks',
                children: [],
              },
            ],
          },
          {
            id: 'transformer',
            label: 'Transformer',
            type: 'paper',
            year: 2017,
            description: '"Attention Is All You Need" — Vaswani et al. introduced the Transformer architecture, replacing recurrence with self-attention.',
            url: 'https://arxiv.org/abs/1706.03762',
            branch: 'neural-networks',
            children: [],
          },
        ],
      },

      // ── NLP Branch ──────────────────────────────────────────
      {
        id: 'nlp',
        label: 'Natural Language Processing',
        type: 'concept',
        year: 1950,
        description: 'The study of computational approaches to understanding and generating human language.',
        url: 'https://en.wikipedia.org/wiki/Natural_language_processing',
        branch: 'nlp',
        children: [
          {
            id: 'turing-test',
            label: 'Turing Test',
            type: 'paper',
            year: 1950,
            description: 'Alan Turing proposed the "imitation game" — if a machine can converse indistinguishably from a human, it exhibits intelligence.',
            url: 'https://doi.org/10.1093/mind/LIX.236.433',
            branch: 'nlp',
            children: [],
          },
          {
            id: 'eliza',
            label: 'ELIZA',
            type: 'software',
            year: 1966,
            description: 'Joseph Weizenbaum created ELIZA, an early chatbot that simulated a Rogerian psychotherapist using pattern matching.',
            url: 'https://en.wikipedia.org/wiki/ELIZA',
            branch: 'nlp',
            children: [],
          },
          {
            id: 'word2vec',
            label: 'Word2Vec',
            type: 'paper',
            year: 2013,
            description: 'Mikolov et al. at Google introduced efficient word embedding methods, enabling semantic vector representations of words.',
            url: 'https://arxiv.org/abs/1301.3781',
            branch: 'nlp',
            children: [],
          },
          {
            id: 'bert',
            label: 'BERT',
            type: 'paper',
            year: 2018,
            description: 'Google\'s BERT introduced bidirectional pre-training of Transformers, achieving state-of-the-art on 11 NLP tasks.',
            url: 'https://arxiv.org/abs/1810.04805',
            branch: 'nlp',
            children: [],
          },
          {
            id: 'gpt',
            label: 'GPT',
            type: 'paper',
            year: 2018,
            description: 'OpenAI introduced GPT — Generative Pre-trained Transformer using unsupervised pre-training followed by supervised fine-tuning.',
            url: 'https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf',
            branch: 'nlp',
            children: [
              {
                id: 'gpt3',
                label: 'GPT-3',
                type: 'software',
                year: 2020,
                description: 'OpenAI\'s 175B parameter model demonstrated remarkable few-shot learning abilities across diverse tasks.',
                url: 'https://arxiv.org/abs/2005.14165',
                branch: 'nlp',
                children: [
                  {
                    id: 'chatgpt',
                    label: 'ChatGPT',
                    type: 'software',
                    year: 2022,
                    description: 'OpenAI launched ChatGPT, an RLHF-fine-tuned conversational AI that reached 100M users in 2 months.',
                    url: 'https://openai.com/chatgpt',
                    branch: 'nlp',
                    children: [
                      {
                        id: 'gpt4',
                        label: 'GPT-4',
                        type: 'software',
                        year: 2023,
                        description: 'OpenAI\'s multimodal model accepting text and image inputs, demonstrating human-level performance on many benchmarks.',
                        url: 'https://openai.com/gpt-4',
                        branch: 'nlp',
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'claude',
            label: 'Claude',
            type: 'software',
            year: 2023,
            description: 'Anthropic released Claude, an AI assistant trained with Constitutional AI for helpfulness, harmlessness, and honesty.',
            url: 'https://www.anthropic.com/claude',
            branch: 'nlp',
            children: [
              {
                id: 'claude3',
                label: 'Claude 3',
                type: 'software',
                year: 2024,
                description: 'Anthropic\'s Claude 3 family (Haiku, Sonnet, Opus) achieved frontier performance across reasoning, math, and coding.',
                url: 'https://www.anthropic.com/news/claude-3-family',
                branch: 'nlp',
                children: [],
              },
            ],
          },
          {
            id: 'llama',
            label: 'LLaMA',
            type: 'software',
            year: 2023,
            description: 'Meta released LLaMA — a collection of open-weight large language models, catalyzing the open-source AI movement.',
            url: 'https://ai.meta.com/llama/',
            branch: 'nlp',
            children: [],
          },
        ],
      },

      // ── Computer Vision Branch ──────────────────────────────
      {
        id: 'cv',
        label: 'Computer Vision',
        type: 'concept',
        year: 1966,
        description: 'The field of enabling computers to interpret and understand visual information from the world.',
        url: 'https://en.wikipedia.org/wiki/Computer_vision',
        branch: 'computer-vision',
        children: [
          {
            id: 'imagenet',
            label: 'ImageNet',
            type: 'event',
            year: 2009,
            description: 'Fei-Fei Li\'s ImageNet dataset (14M+ images, 20K+ categories) became the benchmark that drove the deep learning revolution in vision.',
            url: 'https://www.image-net.org/',
            branch: 'computer-vision',
            children: [],
          },
          {
            id: 'yolo',
            label: 'YOLO',
            type: 'paper',
            year: 2015,
            description: 'Redmon et al. introduced "You Only Look Once" — real-time object detection treating it as a single regression problem.',
            url: 'https://arxiv.org/abs/1506.02640',
            branch: 'computer-vision',
            children: [],
          },
          {
            id: 'vit',
            label: 'Vision Transformer (ViT)',
            type: 'paper',
            year: 2020,
            description: 'Dosovitskiy et al. applied Transformers directly to image patches, matching or exceeding CNN performance.',
            url: 'https://arxiv.org/abs/2010.11929',
            branch: 'computer-vision',
            children: [],
          },
        ],
      },

      // ── Reinforcement Learning Branch ───────────────────────
      {
        id: 'rl',
        label: 'Reinforcement Learning',
        type: 'concept',
        year: 1992,
        description: 'Learning through interaction with an environment to maximize cumulative reward.',
        url: 'https://en.wikipedia.org/wiki/Reinforcement_learning',
        branch: 'reinforcement-learning',
        children: [
          {
            id: 'td-learning',
            label: 'TD-Learning',
            type: 'paper',
            year: 1988,
            description: 'Richard Sutton introduced Temporal Difference learning, combining Monte Carlo and dynamic programming ideas.',
            url: 'https://doi.org/10.1007/BF00115009',
            branch: 'reinforcement-learning',
            children: [],
          },
          {
            id: 'deep-blue',
            label: 'Deep Blue',
            type: 'event',
            year: 1997,
            description: 'IBM\'s Deep Blue defeated world chess champion Garry Kasparov — a landmark moment for game-playing AI.',
            url: 'https://en.wikipedia.org/wiki/Deep_Blue_(chess_computer)',
            branch: 'reinforcement-learning',
            children: [],
          },
          {
            id: 'dqn',
            label: 'DQN',
            type: 'paper',
            year: 2013,
            description: 'DeepMind combined deep learning with Q-learning, achieving human-level performance on Atari games.',
            url: 'https://arxiv.org/abs/1312.5602',
            branch: 'reinforcement-learning',
            children: [
              {
                id: 'alphago',
                label: 'AlphaGo',
                type: 'event',
                year: 2016,
                description: 'DeepMind\'s AlphaGo defeated Go world champion Lee Sedol 4-1, a feat previously thought decades away.',
                url: 'https://deepmind.google/technologies/alphago/',
                branch: 'reinforcement-learning',
                children: [
                  {
                    id: 'alphafold',
                    label: 'AlphaFold',
                    type: 'software',
                    year: 2020,
                    description: 'DeepMind\'s AlphaFold solved the protein folding problem, predicting 3D structures with atomic accuracy.',
                    url: 'https://alphafold.ebi.ac.uk/',
                    branch: 'reinforcement-learning',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ── Generative AI Branch ────────────────────────────────
      {
        id: 'gen-ai',
        label: 'Generative AI',
        type: 'concept',
        year: 2014,
        description: 'AI systems that can generate new content — text, images, audio, video — from learned patterns.',
        url: 'https://en.wikipedia.org/wiki/Generative_artificial_intelligence',
        branch: 'generative-ai',
        children: [
          {
            id: 'gan',
            label: 'GANs',
            type: 'paper',
            year: 2014,
            description: 'Ian Goodfellow introduced Generative Adversarial Networks — two neural networks competing to generate realistic data.',
            url: 'https://arxiv.org/abs/1406.2661',
            branch: 'generative-ai',
            children: [
              {
                id: 'stylegan',
                label: 'StyleGAN',
                type: 'paper',
                year: 2018,
                description: 'NVIDIA\'s StyleGAN generated photorealistic human faces, demonstrating the power of progressive training.',
                url: 'https://arxiv.org/abs/1812.04948',
                branch: 'generative-ai',
                children: [],
              },
            ],
          },
          {
            id: 'diffusion',
            label: 'Diffusion Models',
            type: 'paper',
            year: 2020,
            description: 'Ho et al. introduced denoising diffusion probabilistic models (DDPM), surpassing GANs in image quality.',
            url: 'https://arxiv.org/abs/2006.11239',
            branch: 'generative-ai',
            children: [
              {
                id: 'dalle',
                label: 'DALL·E',
                type: 'software',
                year: 2021,
                description: 'OpenAI\'s DALL·E generated images from text descriptions, bridging language and vision in generative AI.',
                url: 'https://openai.com/dall-e-2',
                branch: 'generative-ai',
                children: [],
              },
              {
                id: 'stable-diffusion',
                label: 'Stable Diffusion',
                type: 'software',
                year: 2022,
                description: 'Stability AI released Stable Diffusion as open-source, democratizing high-quality image generation.',
                url: 'https://stability.ai/',
                branch: 'generative-ai',
                children: [],
              },
              {
                id: 'midjourney',
                label: 'Midjourney',
                type: 'software',
                year: 2022,
                description: 'Midjourney became the leading artistic AI image generator, known for its distinctive aesthetic style.',
                url: 'https://www.midjourney.com/',
                branch: 'generative-ai',
                children: [],
              },
              {
                id: 'sora',
                label: 'Sora',
                type: 'software',
                year: 2024,
                description: 'OpenAI\'s Sora generates high-fidelity videos from text prompts, representing a leap in video generation.',
                url: 'https://openai.com/sora',
                branch: 'generative-ai',
                children: [],
              },
            ],
          },
        ],
      },

      // ── Expert Systems / Knowledge Branch ────────────────────
      {
        id: 'knowledge',
        label: 'Expert Systems & Knowledge',
        type: 'concept',
        year: 1965,
        description: 'Rule-based systems encoding human expertise and structured knowledge representation.',
        url: 'https://en.wikipedia.org/wiki/Expert_system',
        branch: 'knowledge',
        children: [
          {
            id: 'dendral',
            label: 'DENDRAL',
            type: 'software',
            year: 1965,
            description: 'The first expert system, designed at Stanford to identify molecular structures from mass spectrometry data.',
            url: 'https://en.wikipedia.org/wiki/Dendral',
            branch: 'knowledge',
            children: [],
          },
          {
            id: 'expert-boom',
            label: 'Expert Systems Boom',
            type: 'event',
            year: 1980,
            description: 'Commercial expert systems like XCON generated millions in savings, leading to massive industry investment.',
            url: 'https://en.wikipedia.org/wiki/Expert_system#History',
            branch: 'knowledge',
            children: [],
          },
          {
            id: 'watson',
            label: 'IBM Watson',
            type: 'event',
            year: 2011,
            description: 'IBM Watson defeated Jeopardy! champions using NLP, information retrieval, and knowledge representation.',
            url: 'https://en.wikipedia.org/wiki/Watson_(computer)',
            branch: 'knowledge',
            children: [],
          },
          {
            id: 'knowledge-graph',
            label: 'Google Knowledge Graph',
            type: 'software',
            year: 2012,
            description: 'Google launched the Knowledge Graph, structuring web information into entities and relationships.',
            url: 'https://blog.google/products/search/introducing-knowledge-graph-things-not/',
            branch: 'knowledge',
            children: [],
          },
        ],
      },

      // ── Robotics & Embodied AI Branch ───────────────────────
      {
        id: 'robotics',
        label: 'Robotics & Embodied AI',
        type: 'concept',
        year: 1961,
        description: 'Physical AI systems that interact with the real world through sensors and actuators.',
        url: 'https://en.wikipedia.org/wiki/Robotics',
        branch: 'robotics',
        children: [
          {
            id: 'unimate',
            label: 'Unimate',
            type: 'event',
            year: 1961,
            description: 'The first industrial robot was installed at GM\'s assembly line, beginning the age of industrial automation.',
            url: 'https://en.wikipedia.org/wiki/Unimate',
            branch: 'robotics',
            children: [],
          },
          {
            id: 'roomba',
            label: 'Roomba',
            type: 'software',
            year: 2002,
            description: 'iRobot launched Roomba, making autonomous robotics a household reality.',
            url: 'https://www.irobot.com/',
            branch: 'robotics',
            children: [],
          },
          {
            id: 'boston-dynamics',
            label: 'Atlas (Boston Dynamics)',
            type: 'event',
            year: 2013,
            description: 'Boston Dynamics\' Atlas demonstrated unprecedented humanoid mobility — running, jumping, and doing backflips.',
            url: 'https://bostondynamics.com/atlas/',
            branch: 'robotics',
            children: [],
          },
          {
            id: 'tesla-bot',
            label: 'Tesla Optimus',
            type: 'event',
            year: 2024,
            description: 'Tesla\'s humanoid robot Optimus aims to perform general-purpose tasks, combining vision AI with robotics.',
            url: 'https://www.tesla.com/AI',
            branch: 'robotics',
            children: [],
          },
        ],
      },
    ],
  };

  const crossRefs = [
    { source: 'transformer', target: 'bert', label: 'Architecture basis' },
    { source: 'transformer', target: 'gpt', label: 'Architecture basis' },
    { source: 'transformer', target: 'vit', label: 'Adapted to vision' },
    { source: 'backprop', target: 'word2vec', label: 'Training method' },
    { source: 'alexnet', target: 'imagenet', label: 'Won challenge' },
    { source: 'dqn', target: 'deep-learning', label: 'Applied deep learning' },
    { source: 'gpt3', target: 'dalle', label: 'Shared architecture' },
    { source: 'diffusion', target: 'sora', label: 'Core technique' },
    { source: 'alphago', target: 'alphafold', label: 'Evolved from' },
    { source: 'lenet', target: 'alexnet', label: 'Inspired architecture' },
    { source: 'gan', target: 'diffusion', label: 'Generative paradigm shift' },
    { source: 'chatgpt', target: 'claude', label: 'Market competition' },
    { source: 'stable-diffusion', target: 'midjourney', label: 'Same era' },
    { source: 'resnet', target: 'vit', label: 'Benchmark comparison' },
  ];

  return { tree, crossRefs };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Generic topic generator (generates a plausible tree for any keyword)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function generateGenericTree(keyword) {
  const kw = keyword.trim();

  const tree = {
    id: 'root',
    label: kw,
    type: 'discipline',
    year: 1900,
    description: `The origin and development history of ${kw}. This tree is auto-generated — connect to a real API to populate with actual data.`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(kw)}`,
    branch: 'root',
    children: [
      {
        id: 'origins',
        label: `Origins of ${kw}`,
        type: 'concept',
        year: 1910,
        description: `The foundational ideas and early developments that led to ${kw}.`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(kw)}#History`,
        branch: 'origins',
        children: [
          { id: 'early-1', label: 'Early Theories', type: 'paper', year: 1920, description: 'Early theoretical foundations.', url: '#', branch: 'origins', children: [] },
          { id: 'early-2', label: 'First Experiments', type: 'event', year: 1935, description: 'Pioneering experimental work.', url: '#', branch: 'origins', children: [] },
        ],
      },
      {
        id: 'golden-age',
        label: `${kw} Golden Age`,
        type: 'concept',
        year: 1950,
        description: `The period of rapid advancement and mainstream adoption.`,
        url: '#',
        branch: 'golden-age',
        children: [
          { id: 'key-innovation', label: 'Key Innovation', type: 'milestone', year: 1960, description: 'A breakthrough that changed the field.', url: '#', branch: 'golden-age', children: [] },
          { id: 'commercial', label: 'Commercialization', type: 'software', year: 1975, description: 'The technology enters the market.', url: '#', branch: 'golden-age', children: [] },
        ],
      },
      {
        id: 'modern-era',
        label: `Modern ${kw}`,
        type: 'concept',
        year: 2000,
        description: 'Contemporary developments and the current state of the art.',
        url: '#',
        branch: 'modern',
        children: [
          { id: 'digital', label: 'Digital Revolution', type: 'event', year: 2005, description: 'Digital transformation of the field.', url: '#', branch: 'modern', children: [] },
          { id: 'current', label: 'Current State', type: 'milestone', year: 2024, description: 'Where we are today.', url: '#', branch: 'modern', children: [] },
        ],
      },
    ],
  };

  const crossRefs = [
    { source: 'early-2', target: 'key-innovation', label: 'Led to' },
    { source: 'commercial', target: 'digital', label: 'Enabled by' },
  ];

  return { tree, crossRefs };
}

// ── Branch color map ─────────────────────────────────────────
export const BRANCH_COLORS = {
  'root':                  '#ffffff',
  'neural-networks':       '#4a9eff',
  'nlp':                   '#4aff9e',
  'computer-vision':       '#ff9e4a',
  'reinforcement-learning':'#ff4a8a',
  'generative-ai':         '#c84aff',
  'knowledge':             '#ffea4a',
  'robotics':              '#4affea',
  'origins':               '#9e9eff',
  'golden-age':            '#ffcc4a',
  'modern':                '#4affb8',
};

// ── Node type icons (Unicode) ────────────────────────────────
export const NODE_ICONS = {
  discipline: '◉',
  concept:    '◈',
  paper:      '📄',
  software:   '⚙',
  event:      '⭐',
  milestone:  '🏁',
};

// ── Node type colors ─────────────────────────────────────────
export const TYPE_COLORS = {
  discipline: '#ffffff',
  concept:    '#b8b8ff',
  paper:      '#4a9eff',
  software:   '#4aff9e',
  event:      '#ffaa4a',
  milestone:  '#ff4a8a',
};

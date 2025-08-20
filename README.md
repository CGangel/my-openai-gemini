## Why

The Gemini API is [free](https://ai.google.dev/pricing "limits applied!"),
but there are many tools that work exclusively with the OpenAI API.

This project provides a personal OpenAI-compatible endpoint for free.


## Serverless?

Although it runs in the cloud, it does not require server maintenance.
It can be easily deployed to various providers for free
(with generous limits suitable for personal use).

> [!TIP]
> Running the proxy endpoint locally is also an option,
> though it's more appropriate for development use.


## How to start

You will need a personal Google [API key](https://makersuite.google.com/app/apikey).

> [!IMPORTANT]
> Even if you are located outside of the [supported regions](https://ai.google.dev/gemini-api/docs/available-regions#available_regions),
> it is still possible to acquire one using a VPN.

Deploy the project to one of the providers, using the instructions below.
You will need to set up an account there.

If you opt for “button-deploy”, you'll be guided through the process of forking the repository first,
which is necessary for continuous integration (CI).


### Deploy with Vercel

 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CGangel/my-openai-gemini&repository-name=my-openai-gemini)
- Alternatively can be deployed with [cli](https://vercel.com/docs/cli):
  `vercel deploy`
- Serve locally: `vercel dev`
- Vercel _Functions_ [limitations](https://vercel.com/docs/functions/limitations) (with _Edge_ runtime)


### 部署到Netlify（你猜我为什么只翻译这个？）

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/CGangel/my-openai-gemini&integrationName=integrationName&integrationSlug=integrationSlug&integrationDescription=integrationDescription)
- Alternatively can be deployed with [cli](https://docs.netlify.com/cli/get-started/):
  `netlify deploy`
- Serve locally: `netlify dev`



### Deploy to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/CGangel/my-openai-gemini)
- Alternatively can be deployed manually pasting content of [`src/worker.mjs`](src/worker.mjs)
  to https://workers.cloudflare.com/playground (see there `Deploy` button).
- Alternatively can be deployed with [cli](https://developers.cloudflare.com/workers/wrangler/):
  `wrangler deploy`
- Serve locally: `wrangler dev`
- _Worker_ [limits](https://developers.cloudflare.com/workers/platform/limits/#worker-limits)





## 注意
- api将仅代理/V1beta目录
- 你可以通过/v1beta/openai/...调用
- 也可以通过/v1beta/models/..（gemini默认调用方式）调用




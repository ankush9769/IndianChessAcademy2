# Deploying to Render

This guide walks you through deploying your Next.js chess application to Render.

## Prerequisites

1. A [Render](https://render.com) account (free tier available)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Using render.yaml (Blueprint)

1. **Push your code to Git** (if not already done)
   ```bash
   git add .
   git commit -m "Add Render deployment config"
   git push
   ```

2. **Create New Blueprint on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to create the service

### Option 2: Manual Setup

1. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository

3. **Configure Service**
   - **Name**: `reschess` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Environment Variables** (if needed)
   - Click "Advanced"
   - Add any required environment variables:
     - `NODE_VERSION`: `18.17.0`
     - `NODE_ENV`: `production`
     - Add database URLs, API keys, etc.

5. **Select Plan**
   - Choose "Free" for testing
   - Upgrade later if needed (free tier sleeps after inactivity)

6. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app
   - First deployment takes 5-10 minutes

## Post-Deployment

### Your Live URL
Your app will be available at: `https://reschess.onrender.com` (or your custom name)

### Custom Domain (Optional)
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain and follow DNS configuration instructions

### Environment Variables
Add these in Render Dashboard → Service → Environment:
- Database connection strings
- API keys
- Authentication secrets
- Any other sensitive configuration

### Auto-Deploy
Render automatically deploys when you push to your connected branch.

## Monitoring

- **Logs**: View in Render Dashboard → Service → Logs
- **Metrics**: Check Dashboard for CPU, memory usage
- **Health Checks**: Render automatically monitors your service

## Troubleshooting

### Build Fails
- Check build logs in Render Dashboard
- Verify all dependencies are in `package.json`
- Ensure build command matches your local setup

### App Won't Start
- Check start command is `npm start`
- Verify port binding (Render provides `PORT` env var)
- Review startup logs

### Performance Issues (Free Tier)
- Free tier sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to Starter plan ($7/month) for always-on

## Upgrade from Free Tier

When ready for production:
1. Go to Service Settings
2. Click "Upgrade Plan"
3. Select Starter ($7/mo) or higher
4. Benefits:
   - No sleep
   - More resources
   - Better performance
   - Custom domains with SSL

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

## Next Steps

1. ✅ Deploy your app
2. ⚙️ Configure environment variables
3. 🌐 Add custom domain (optional)
4. 📊 Monitor logs and metrics
5. 🚀 Share your live app!

Your app URL: `https://[your-service-name].onrender.com`

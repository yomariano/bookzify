import React from "react";
import { HeroScrollDemo } from "@/components/HeroScrollDemo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, Star, LibraryBig, HeadphonesIcon, ListFilter, BookMarked,
  Sparkles, Clock, BookText, Trophy, Waves, Shield, Zap,
  Menu, X
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/app/hooks/use-mobile";

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="ml-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BookHub
                </span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="#features">Features</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="#pricing">Pricing</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/about">About</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">Login</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Scroll Animation */}
      <section className="pt-16">
        <HeroScrollDemo />
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Powerful Features for Book Lovers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BookHub brings together everything you need to enjoy, manage, and experience books in new ways.
            </p>
          </div>

          <div className={`grid gap-4 sm:gap-6 md:gap-8 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            <FeatureCard
              icon={<LibraryBig size={isMobile ? 20 : 24} className="text-primary" />}
              title="Personal Library"
              description="Store and organize your entire book collection in one place, accessible from any device."
              highlight="Popular"
            />
            <FeatureCard
              icon={<HeadphonesIcon size={isMobile ? 20 : 24} className="text-primary" />}
              title="AI Audiobooks"
              description="Convert any book to audio with natural-sounding voices and customizable playback."
              highlight="Premium"
            />
            <FeatureCard
              icon={<Star size={isMobile ? 20 : 24} className="text-primary" />}
              title="AI Summaries"
              description="Get concise, intelligent summaries of any book to help you decide what to read next."
              highlight="Premium"
            />
            <FeatureCard
              icon={<ListFilter size={isMobile ? 20 : 24} className="text-primary" />}
              title="Smart Recommendations"
              description="Discover new books based on your reading history, preferences, and reading goals."
            />
            <FeatureCard
              icon={<BookMarked size={isMobile ? 20 : 24} className="text-primary" />}
              title="Kindle Integration"
              description="Send books directly to your Kindle device with just one click."
              highlight="Premium"
            />
            <FeatureCard
              icon={<BookOpen size={isMobile ? 20 : 24} className="text-primary" />}
              title="Reading Insights"
              description="Track your reading habits, progress, and achievements with detailed analytics."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Choose Your Perfect Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the plan that fits your reading needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
            {/* Free Plan */}
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Basic</CardTitle>
                <div className="mt-4 flex justify-center">
                  <span className="text-4xl font-bold">Free</span>
                </div>
                <CardDescription className="mt-2">Perfect for casual readers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <PricingFeature>
                    <BookText className="h-5 w-5 text-primary" />
                    <span>Personal library (up to 50 books)</span>
                  </PricingFeature>
                  <PricingFeature>
                    <ListFilter className="h-5 w-5 text-primary" />
                    <span>Basic recommendations</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Reading progress tracking</span>
                  </PricingFeature>
                  <PricingFeature available={false}>
                    <HeadphonesIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">AI Audiobooks</span>
                  </PricingFeature>
                  <PricingFeature available={false}>
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">AI Summaries</span>
                  </PricingFeature>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-primary relative before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-primary/20 before:blur-xl md:scale-105 md:-translate-y-2">
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                Popular
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Premium</CardTitle>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">For dedicated book lovers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <PricingFeature>
                    <BookText className="h-5 w-5 text-primary" />
                    <span>Unlimited library storage</span>
                  </PricingFeature>
                  <PricingFeature>
                    <HeadphonesIcon className="h-5 w-5 text-primary" />
                    <span>5 AI Audiobooks / month</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Star className="h-5 w-5 text-primary" />
                    <span>10 AI Summaries / month</span>
                  </PricingFeature>
                  <PricingFeature>
                    <BookMarked className="h-5 w-5 text-primary" />
                    <span>Kindle integration</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Enhanced recommendations</span>
                  </PricingFeature>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/signup">Start Premium</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-border hover:border-accent/50 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">$24.99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">For professional researchers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <PricingFeature>
                    <BookText className="h-5 w-5 text-accent" />
                    <span>Everything in Premium</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Zap className="h-5 w-5 text-accent" />
                    <span>Unlimited AI features</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Trophy className="h-5 w-5 text-accent" />
                    <span>Team collaboration tools</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Waves className="h-5 w-5 text-accent" />
                    <span>Custom voice audiobooks</span>
                  </PricingFeature>
                  <PricingFeature>
                    <Shield className="h-5 w-5 text-accent" />
                    <span>Priority support</span>
                  </PricingFeature>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8 md:mt-16 text-center">
            <p className="text-muted-foreground mb-6">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <Button 
              size={isMobile ? "default" : "lg"} 
              className={`rounded-full ${isMobile ? 'w-full' : ''}`} 
              asChild
            >
              <Link to="/dashboard">Start Reading Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Reading Experience?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of readers who have transformed how they discover, consume, and enjoy books.
          </p>
          <div className={`flex flex-wrap justify-center gap-4 ${isMobile ? 'flex-col' : ''}`}>
            <Button 
              size={isMobile ? "default" : "lg"} 
              className={`rounded-full ${isMobile ? 'w-full' : ''}`} 
              asChild
            >
              <Link to="/dashboard">Get Started for Free</Link>
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"} 
              className={`rounded-full ${isMobile ? 'w-full' : ''}`}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BookHub
                </span>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Your personal library in the cloud
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link to="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link to="/guides" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} BookHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, highlight }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  highlight?: string
}) => {
  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border relative hover:border-primary/50 transition-colors group">
      {highlight && (
        <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
          {highlight}
        </div>
      )}
      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
    </div>
  );
};

const PricingFeature = ({ children, available = true }: { 
  children: React.ReactNode,
  available?: boolean 
}) => {
  return (
    <li className={`flex items-center space-x-3 ${available ? "" : "opacity-70"}`}>
      {children}
    </li>
  );
};

export default Landing;

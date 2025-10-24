<script setup lang="ts">
const router = useRouter();
const { session } = useAuthStore();

// Redirect to dashboard if already logged in
watchEffect(() => {
    if (session) {
        router.push("/dashboard");
    }
});

const navigateToLogin = async () => {
    await navigateTo("/login");
};
</script>

<template>
    <div class="min-h-screen bg-background">
        <!-- Header -->
        <header class="border-b border-border/40">
            <div class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Rss class="w-8 h-8 text-primary" />
                        <h1 class="text-2xl font-bold">📕 RSS Reader</h1>
                    </div>
                    <div class="flex items-center gap-4">
                        <ThemeSwitcher />
                        <Button @click="navigateToLogin" variant="default">
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="container mx-auto px-6 py-20 md:py-32">
            <div class="max-w-4xl mx-auto text-center">
                <h2
                    class="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
                >
                    Stay updated with
                    <span class="text-primary">your favorite content</span>
                </h2>
                <p
                    class="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed"
                >
                    A simple, elegant RSS reader that helps you follow blogs,
                    news sites, and podcasts—all in one place.
                </p>
                <div class="flex items-center justify-center gap-4">
                    <Button @click="navigateToLogin" size="lg" class="text-lg">
                        Get Started
                    </Button>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="container mx-auto px-6 py-20 border-t border-border/40">
            <div class="max-w-5xl mx-auto">
                <h3
                    class="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
                >
                    Everything you need, nothing you don't
                </h3>
                <div class="grid md:grid-cols-3 gap-12">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        >
                            <span class="text-4xl"> 📊 </span>
                        </div>
                        <h4 class="text-xl font-semibold mb-3">
                            Easy Feed Management
                        </h4>
                        <p class="text-muted-foreground leading-relaxed">
                            Add, organize, and manage all your RSS feeds in one
                            clean interface. No complexity, just simplicity.
                        </p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        >
                            <span class="text-4xl">🔍</span>
                        </div>
                        <h4 class="text-xl font-semibold mb-3">
                            Powerful Search
                        </h4>
                        <p class="text-muted-foreground leading-relaxed">
                            Find articles instantly with fast, fuzzy search
                            across all your feeds and content.
                        </p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        >
                            <span class="text-4xl">🔔</span>
                        </div>
                        <h4 class="text-xl font-semibold mb-3">Stay Updated</h4>
                        <p class="text-muted-foreground leading-relaxed">
                            Automatic feed refreshing keeps you in sync with the
                            latest articles from your favorite sources.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="container mx-auto px-6 py-20 border-t border-border/40">
            <div
                class="max-w-3xl mx-auto text-center bg-muted/30 rounded-3xl p-12 md:p-16"
            >
                <h3 class="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                    Ready to take control of your reading?
                </h3>
                <p class="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Join others who have rediscovered the joy of curated,
                    chronological content.
                </p>
                <Button @click="navigateToLogin" size="lg" class="text-lg">
                    Start Reading
                </Button>
            </div>
        </section>

        <!-- Footer -->
        <footer class="border-t border-border/40 mt-20">
            <div class="container mx-auto px-6 py-8">
                <div class="text-center text-muted-foreground">
                    <p>
                        &copy; 2025 Build by
                        <NuxtLink
                            target="_blank"
                            :external="true"
                            to="https://aldas.dev"
                            >Aldas</NuxtLink
                        >
                        🚀.
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

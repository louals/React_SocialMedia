import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/authContext";
const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);

    if (!session) {
      toast({ title: "Login failed. Please check your credentials." });
      return;
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      toast({ title: "Login failed. Please try again." });
    }
  };

  const isLoading = isUserLoading || isSigningIn;

  return (
    /* OUTER WRAPPER: Ensures the background is always black and centered */
    <div className="flex-center flex-col w-full min-h-screen bg-black">
      
      {/* RESPONSIVE CONTAINER: 
          - Mobile: Full width, p-8, no border
          - Desktop: 420px width, p-12, border, rounded-3xl 
      */}
      <div className="w-full sm:w-420 flex flex-col justify-center p-8 sm:p-12 
                      bg-black sm:border sm:border-zinc-800 sm:rounded-3xl sm:shadow-2xl">
        
        <Form {...form}>
          <div className="flex flex-col items-center w-full">
            {/* Logo: Slightly smaller on mobile */}
            <img 
              src="/assets/images/logo.png" 
              alt="logo" 
              className="w-28 sm:w-32 mb-6" 
            />
            
            <div className="text-center mb-8">
              <h2 className="h3-bold md:h2-bold text-white">Log in to your account</h2>
              <p className="text-zinc-500 small-medium md:base-regular mt-2">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSignin)}
              className="flex flex-col gap-5 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="shad-input bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary-500 h-11"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="shad-input bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary-500 h-11"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="shad-button_primary w-full h-11 transition-all active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4 my-2">
                <div className="h-[1px] bg-zinc-800 flex-1" />
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">OR</p>
                <div className="h-[1px] bg-zinc-800 flex-1" />
              </div>

              <p className="text-small-regular text-light-2 text-center mt-2">
                Don't have an account?
                <Link
                  to="/sign-up"
                  className="text-primary-500 text-small-semibold ml-1 hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SigninForm;
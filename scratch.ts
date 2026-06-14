// Force real backend BEFORE importing
process.env.NEXT_PUBLIC_API_URL = 'https://mahaseel-production.up.railway.app/api/v1';

async function runTest() {
  const { signUp, verifyEmail, signIn } = await import('./src/services/api/auth');
  const { getMe, updateMe } = await import('./src/services/api/users');

  const testEmail = `testuser${Date.now()}@example.com`;
  const testPhone = `05${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testPassword = 'Password123!';

  try {
    console.log('1. Signing up...');
    try {
      await signUp({
        fullName: 'Original Name',
        email: testEmail,
        phone: testPhone,
        password: testPassword,
      });
    } catch (error: unknown) {
      console.log('Signup failed:', error instanceof Error ? error.message : error);
    }

    console.log('2. Trying to sign in to get token (if OTP is not strictly required)...');
    let authRes;
    try {
      authRes = await verifyEmail({ email: testEmail, code: '123456' });
    } catch {
      console.log('Verification failed, trying direct signin...');
      authRes = await signIn({ email: testEmail, password: testPassword });
    }

    const token = authRes.accessToken;
    console.log('Login User Name:', authRes.user.name);

    console.log('3. Updating name to "New Name"...');
    try {
      const updateRes = await updateMe({ fullName: 'New Name' }, token);
      console.log('Update Response Name:', updateRes.fullName);
    } catch (error: unknown) {
      console.log('Update error:', error instanceof Error ? error.message : error);
    }

    console.log('4. Fetching getMe...');
    try {
      const meRes = await getMe(token);
      console.log('getMe User Name:', meRes.fullName);
    } catch (error: unknown) {
      console.log('getMe error:', error instanceof Error ? error.message : error);
    }

    console.log('5. Signing in again...');
    try {
      const loginRes2 = await signIn({ email: testEmail, password: testPassword });
      console.log('Second Login User Name:', loginRes2.user.name);
    } catch (error: unknown) {
      console.log('Second Login error:', error instanceof Error ? error.message : error);
    }
  } catch (error: unknown) {
    console.error('Test failed:', error instanceof Error ? error.message : error);
  }
}

runTest();
